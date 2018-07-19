const $chartSvg = d3.select('svg.scatter')
let viewportWidth = null;
let viewportHeight = null;
let isMobile = null;
let svgWidth = null;
let svgHeight = null;

const JOB_LABEL_MARGIN_LEFT = 60;
// const ALL_JOBS_STARTING_Y_LOCATION = 15;
const ALL_JOBS_STARTING_Y_LOCATION = 10;
// const ALL_JOBS_SKILL_SPACING = 10.2;
let ALL_JOBS_SKILL_SPACING = null;
const XBUMP = 250;
const TRANSITION_DURATION_SKILLS_DIFFERENCE = 500;
const JOB_STACKED_SKILL_DELAY = 3.67647059
const DIFFERENCE_RECT_HEIGHT = 3

let $devCircles = null;
let $truckerCircles = null;
let $skillSectionsText= null;
let $axisLines = null;
let $skillSectionsTextAllJobs = null;
let $axisDifferenceRects = null;
let $axisDifferenceRectsAllJobs = null;
let $truckerDeveloperXAxis = null;
let $introJobsCircles = null;

let allData = null;
let allJobSkillsFlat = null;
let allJobSkillsGrouped = null;
let devAndTruckerSkills = null;
let scalesObject = {}

let $skillSections = null;
let $skillSectionsAllJobs = null;
let $skillItemsAllJobs = null;





const fileNames = [
  "devs_and_truckers_skills","Choreographers","Dentists","Nurses",
  "Chiropractors","Farmers","Construction_Managers","Firefighters","Geographers","Embalmers",
  "Piplayers","Podiatrists","Fabric_Patternmakers","Clergy","Makeup_Artists",
  "Family_Therapists","CEOs","Art_Directors","Interior_Designers","Craft_Artists",
  "Event_Planners","Veterinarians","Writers","Political_Scientists","Ship_Engineers",
  "Paramedics","Mathematicians","Florists","Travel_Guides","News_Analysts",
  "Musicians","Fitness_Trainers","Graphic_Designers","Childcare_Workers","Police_Officers",
  "Hairdressers","Journalists","Air_Traffic_Controllers","Dancers","Optometrists",
  "Physician_Assistants","Electricians","Ambulance_Drivers","Athletes","Skincare_Specialists",
  "Private_Cooks","Funeral_Attendants","Actors","Judges","Economists",
  "historians","Dental_Assistants","Cobblers","Massage_Therapists","Millwrights",
  "Librarians","Maids","Bartenders","Dishwashers","Fast_Food_Cooks",
  "Barbers","Real_Estate_Agents","Proofreaders"
]

const pathData = 'assets/data/'
let files=[]
fileNames.forEach((fileName)=>{
  files.push(pathData+fileName + '.csv')
})

function resize() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  isMobile = viewportWidth < 700? true : false;
}

function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function setupData(devAndTruckerSkills,allJobSkillsRaw){

  let abrigedCount = 0;
  let arrayCount = 0;
  const NTH_ITEM= 2;
  const ALL_OTHER_ITEM_COUNT = 2000

  devAndTruckerSkills.forEach(skill=>{

    skill.difference = Math.abs(+skill.devs- +skill.truckers)

    if (arrayCount %  NTH_ITEM === 0){
      skill.abrigedNum = abrigedCount
      abrigedCount+=1;
    }
    else{skill.abrigedNum = ALL_OTHER_ITEM_COUNT}

    arrayCount += 1;
  })

  allJobSkillsRaw.forEach(job=>{
    job.forEach(skill=>{
      skill.difference = Math.abs(+skill.job_selected- +skill.job_compared)
    })
  })


  // Calculating xCoord offset for stacked bar chart, Devs and Truckes

  let i;
  let xSum=0;
  let stackPadding=1;

  for (i=0; i<devAndTruckerSkills.length; i++){
    devAndTruckerSkills[i]['xCoordStacked']=xSum
    xSum+=devAndTruckerSkills[i]['difference'] + stackPadding
  }


// Calculating xCoord offset for stacked bar chart, for all jobs

  allJobSkillsRaw.forEach(jobAndTruckerSkills=>{
    xSum=0;
    stackPadding=1;
    for (i=0; i<jobAndTruckerSkills.length; i++){
      jobAndTruckerSkills[i]['xCoordStacked']=xSum
      xSum+= +jobAndTruckerSkills[i]['difference'] + stackPadding
    }
  })

  // Concatenating all the CSVS for previously loaded jobs and making a new array
  // of objects from them, w/ each job name used as a key.

  allJobSkillsFlat = [].concat.apply([], allJobSkillsRaw);
  allJobSkillsGrouped = d3.nest()
    .key(d=>d.job_compared_name)
    .entries(allJobSkillsFlat)
}


function setupScales(){
  svgWidth = $chartSvg.at('width')
  svgHeight = $chartSvg.at('height')
  ALL_JOBS_SKILL_SPACING = svgHeight/(devAndTruckerSkills.length+1)

  const widthPercentage = 0.7;
  const heightPercentage = 0.7;

  const yMaxScaleValue = svgHeight * heightPercentage;
  const xMaxScaleValue = svgWidth * widthPercentage;

  const xPadding = (1-widthPercentage)*svgWidth;
  const yPadding = (1-heightPercentage)*svgHeight;

  scalesObject.xScale = d3.scaleLinear()
  	.domain([0,100])
  	.range([xPadding, xMaxScaleValue]);

  scalesObject.xScaleRectangle = d3.scaleLinear()
  	.domain([0,100])
  	.range([0, (xMaxScaleValue-xPadding)]);


  const xCoordsArray = []
  const xOffsetsForHorizontalBars = allJobSkillsFlat.map(d=> d.xCoordStacked)
  const maxSumBarWidth = d3.max(xOffsetsForHorizontalBars);
  const maxPartBarWidth= maxSumBarWidth/68;
  scalesObject.xScaleEuclidean = d3.scaleLinear()
    .domain([0,100])
    .range([0, maxPartBarWidth]);
}


function setupDOMElements(devAndTruckerSkills) {

  // Creating group elements for each skill, both for developers and for other jobs
  $skillSections = $chartSvg.selectAll('g.skill-section__two-jobs')
    .data(devAndTruckerSkills)
    .enter()
    .append('g.skill-section__two-jobs')
    .st('opacity',0)
    .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*ALL_JOBS_SKILL_SPACING)) +')'});

  $skillSectionsAllJobs = $chartSvg.selectAll('g.all-skills')
    .data(allJobSkillsGrouped)
    .enter()
    .append('g')
    .at('class',d=> 'all-skills '+d.key)

  $skillItemsAllJobs = $skillSectionsAllJobs.selectAll('g.skill-item')
    .data(d=>d.values)
    .enter()
    .append('g')
    .at('class',d=>'skill-item-'+d.skills.replace(/ /g,'_'))


  $axisLines = $skillSections
    .append('line.skill-axis')

  $skillSectionsTextAllJobs = $skillSectionsAllJobs
    .append("text.job-name")


// Original bars signifying different skills
  $axisDifferenceRects = $skillSections.append('rect.skill-difference-axis')

  $axisDifferenceRectsAllJobs = $skillItemsAllJobs.append('rect.skill-difference-axis-all-jobs')

// Adding difference rectangles for devs and truckers

  $axisDifferenceRects
  .at('x', d=>{
    if (+d.devs>=+d.truckers){
      return scalesObject.xScale(+d.truckers)
    }
    else{
      return scalesObject.xScale(+d.devs)
    }
    })
  .at('y', -(DIFFERENCE_RECT_HEIGHT/2) )
  .at('width',d=>{
    return scalesObject.xScaleRectangle(d.difference);
  })
  .at('height', DIFFERENCE_RECT_HEIGHT)
  .st('fill','#E530BE')
  .st('opacity',0)


  $devCircles = $skillSections
    .append('circle.devs-skill-circle')

  $truckerCircles = $skillSections
    .append('circle.truckers-skill-circle')

  $skillSectionsText= $skillSections
    .append("text.job-name")

  $truckerDeveloperXAxis = $chartSvg
    .selectAll('.intro-x-axis')

  $introJobsCircles = $chartSvg
    .selectAll('.trucker-developer-groups')
}

function updateStep(step){
  if(step==='images-two-jobs-all-skills'){

    $axisDifferenceRects
      .transition()
      .st('opacity',0)

    $devCircles
      .transition()
      .duration(1000)
      .st('opacity',1)

    $truckerCircles
      .transition()
      .duration(1000)
      .st('opacity',1)

    // Getting rid of intro axes
    $truckerDeveloperXAxis
      .st('opacity',0)

    $introJobsCircles
      .st('opacity',0)

    $devCircles.at('cx',(d)=> scalesObject.xScale(d.devs))
      .at('r',5)
      .on('mouseenter')

    $truckerCircles.at('cx',(d)=>scalesObject.xScale(d.truckers))
      .at('r',5)

    $skillSections
      .transition()
      .st('opacity',1)

    $skillSectionsText.text(d=>d.skills)
      .st('text-anchor','right')

    $axisLines.at('x1',()=>scalesObject.xScale(0))
      .at('y1',0)
      .at('x2',()=>scalesObject.xScale(100))
      .at('y2',0)
      .at('stroke-width', 1)
      .st('stroke','black')

   $skillSectionsTextAllJobs.at('transform','translate('+JOB_LABEL_MARGIN_LEFT+',0)')
      .text(d=>d.key.replace(/_/g,' '))
      .st('text-anchor','right')
      .st('opacity', 0)
  }
  else if(step==='images-two-jobs-highlight-skill-differences'){

    $skillSections
      .transition()
      .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*ALL_JOBS_SKILL_SPACING)) +')'});

      $skillSectionsText.text(d=>d.skills)
        .st('text-anchor','right')

      $axisLines.at('x1',()=>scalesObject.xScale(0))
        .at('y1',0)
        .at('x2',()=>scalesObject.xScale(100))
        .at('y2',0)
        .at('stroke-width', 1)
        .st('stroke','black')
        .st('opacity',1)

     $skillSectionsTextAllJobs.at('transform','translate('+JOB_LABEL_MARGIN_LEFT+',0)')
        .text(d=>d.key.replace(/_/g,' '))
        .st('text-anchor','right')
        .st('opacity', 0)

    $axisDifferenceRects
      .transition()
      .duration(1000)
      .st('opacity',1)
      .at('x', d=>{
        if (+d.devs>=+d.truckers){
          return scalesObject.xScale(+d.truckers)
        }
        else{
          return scalesObject.xScale(+d.devs)
        }
        })
      .at('y', -(DIFFERENCE_RECT_HEIGHT/2) )
      .at('width',d=>{
        return scalesObject.xScaleRectangle(d.difference);
      })
      .at('height', DIFFERENCE_RECT_HEIGHT)
      .at('transform','translate(0,0)')
      .st('fill','#E530BE')

    $devCircles
      .transition()
      .st('opacity',0)

    $truckerCircles
      .transition()
      .st('opacity',0)
  }
  else if(step==='images-two-jobs-stacked-skills'){

    $skillSectionsAllJobs
      .transition()
      .st('opacity',0)

    $axisLines
      .transition()
      .st('opacity',0)

    $skillSectionsText
      .transition()
      .st('opacity',0)
      .text((d,i)=> {
        if (i===devAndTruckerSkills.length-1){return 'Developers'}
        else return ''
      })
      .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
      .transition()
      .st('opacity',1)

    $devCircles
      .transition()
      .st('opacity',0)

    $truckerCircles
      .transition()
      .st('opacity',0)



    $axisDifferenceRects
      .transition()
      // .delay(1000)
      .duration(TRANSITION_DURATION_SKILLS_DIFFERENCE)
      .at('x',d=> scalesObject.xScaleEuclidean(d.xCoordStacked))
      .at('width',d=> scalesObject.xScaleEuclidean(d.difference))
      .at('transform',(d,i)=>{
        return 'translate('+XBUMP+',0)'
      })

    $skillSections
      .transition()
      .duration(TRANSITION_DURATION_SKILLS_DIFFERENCE)
      // .delay(2000)
      // .duration(500)
      .at('transform',()=> 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (viewportHeight/2) +')')



    $axisDifferenceRects
      .on('mouseenter', d=>console.log(d.skills))

    $skillSectionsTextAllJobs
      .transition()
      .st('opacity',0)
  }
  else if(step==='images-many-jobs-stacked-skills'){

    $chartSvg
      .selectAll('g.similarity-annotation')
      .st('opacity',0)

    $chartSvg
      .selectAll('.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('circle.job')
      .st('opacity',0)

    d3.selectAll('.misc-elements')
      .st('visibility','hidden')

    $skillSections
      .transition()
      .delay((d,i)=>i*JOB_STACKED_SKILL_DELAY)
      .st('opacity',1)

    $chartSvg
      .selectAll('g.all-skills')
      .transition()
      .st('opacity',1)

    $skillSections
      .at('transform',()=> 'translate('+0+','+ 2*ALL_JOBS_STARTING_Y_LOCATION +')')

    $skillSectionsTextAllJobs
      .transition()
      .st('opacity',1)

    $axisDifferenceRectsAllJobs
      .at('x',d=> scalesObject.xScaleEuclidean(d.xCoordStacked))
      .at('width',d=> scalesObject.xScaleEuclidean(d.difference))
      .at('height',3)
      .st('fill','#E530BE')
      .at('transform',(d,i)=>{
        return 'translate('+XBUMP+',0)'
      })
      .on('mouseenter',d=>console.log(d.skills))

    $skillSectionsAllJobs
      .at('transform',(d,i)=>{
        return 'translate(0,'+(i*ALL_JOBS_STARTING_Y_LOCATION+ 3*ALL_JOBS_STARTING_Y_LOCATION)+')'
    })
  }

}

function populateRawSkills(allJobSkillsRaw, response){
  // Note: i=1 here to exclude first entry in data loaded, which reprensents devs comparison
    let i;
    for (i=1;i<response.length;i++){
      allJobSkillsRaw.push(response[i])
    }
}

function init() {
  return new Promise((resolve,reject)=>{

    d3.loadData(...files,(err,response)=>{
      if(err) reject()
      else{
      devAndTruckerSkills = response[0];
      let allJobSkillsRaw = []

      populateRawSkills(allJobSkillsRaw, response)

      resize()
      setupData(devAndTruckerSkills,allJobSkillsRaw)
      setupScales()
      setupDOMElements(devAndTruckerSkills)
      resolve()
      }
    })

  })
}


export default {init, updateStep}


    // Removing previously visible content
    // const truckerDeveloperCircles = $chartSvg.selectAll('circle.truckers-devs-circles');
    // const truckerDeveloperYAxis = $chartSvg.select('g.intro-y-axis');
    // const truckerDeveloperXAxis = $chartSvg.select('g.intro-x-axis');
    // const truckerDeveloperSkillValues = $chartSvg.selectAll('text.two-job-skill-value');
    //
    // truckerDeveloperCircles.st('opacity',0)
    // truckerDeveloperYAxis.st('opacity',0);
    // truckerDeveloperXAxis.st('opacity',0);
    // truckerDeveloperSkillValues.st('opacity',0);

//     const sceneShowTwoJobsAllSkills = new ScrollMagic.Scene({triggerElement: ".two-jobs-all-skills",offset:  0,duration: 1,triggerHook: 0})
//     .on("enter", (e)=>{
//       $devCircles.at('cx',(d)=> xScale(d.devs))
//         .at('r',5)
//         .st('fill','#0B24FB')
//         .on('mouseenter')
//
//       $truckerCircles.at('cx',(d)=>xScale(d.truckers))
//         .at('r',5)
//         .st('fill','#EB5757')
//         .st('opacity',1)
//
//       $skillSections.st('opacity',1)
//       .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*ALL_JOBS_STARTING_Y_LOCATION)) +')'});
//
//       $skillSectionsText.text(d=>d.skills)
//         .st('text-anchor','right')
//         .st('opacity',1)
//
//       $axisLines.at('x1',()=>xScale(0))
//        .at('y1',0)
//        .at('x2',()=>xScale(100))
//        .at('y2',0)
//        .at('stroke-width', 1)
//        .st('stroke','black')
//        .st('opacity',1)
//
//      $skillSectionsTextAllJobs.at('transform','translate('+JOB_LABEL_MARGIN_LEFT+',0)')
//        .text(d=>d.key.replace(/_/g,' '))
//        .st('text-anchor','right')
//     })
//     .on("leave", (e)=>{
//       if(e.target.controller().info("scrollDirection") == "REVERSE"){
//         $devCircles.at('cx',(d)=> xScale(d.devs))
//           .at('r',5)
//           .st('fill','#0B24FB')
//
//         $truckerCircles.st('opacity',0)
//
//         $skillSections.st('opacity',0)
//
//         $skillSectionsText.st('opacity',0)
//
//         $axisLines.st('opacity',0)
//
//         $skillSectionsTextAllJobs.st('opacity',0)
//
//         // d3.selectAll('circle.truckers-devs-circles').st('opacity',1)
//
//         truckerDeveloperCircles.st('opacity',1);
//         truckerDeveloperYAxis.st('opacity',1);
//         truckerDeveloperXAxis.st('opacity',1);
//         truckerDeveloperSkillValues.st('opacity',1);
//       }
//       else{}})
//     .addTo(controllerSkills)
//
//
//
//
// // Adding difference retangles for all other jobs
//
//
//     // showing skill difference
//     const sceneShowDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-skills-difference",offset:  0,duration: 1,triggerHook: 0})
//     .on("enter", (e)=>{
//       $axisDifferenceRects
//        .transition()
//        .st('opacity',1)
//     })
//     .on("leave", (e)=>{
//       if(e.target.controller().info("scrollDirection") == "REVERSE"){
//         $axisDifferenceRects
//          .transition()
//          .st('opacity',0)
//       }
//       else{}})
//     .addTo(controllerSkills)
//
//
//
//
//
//   const sceneStackDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
//   .on("enter", (e)=>{
//
//     $axisLines
//       .transition()
//       .st('opacity',0)
//
//     $skillSectionsText
//       .transition()
//       .st('opacity',0)
//       .text((d,i)=> {
//         if (i===devAndTruckerSkills.length-1){return 'Developers'}
//         else return ''
//       })
//       .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
//       .transition()
//       .st('opacity',1)
//
//     $devCircles
//       .transition()
//       .st('opacity',0)
//
//     $truckerCircles
//       .transition()
//       .st('opacity',0)
//
//
//     $axisDifferenceRects
//       .transition()
//       .delay(1000)
//       .at('x',d=> xScaleEuclidean(d.xCoordStacked))
//       .at('width',d=> xScaleEuclidean(d.difference))
//       .at('transform',(d,i)=>{
//         return 'translate('+XBUMP+',0)'
//       })
//
//     $skillSections
//       .transition()
//       .delay(2000)
//       .duration(500)
//       .at('transform',()=> 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (viewportHeight/2) +')')
//
//     $axisDifferenceRects
//       .on('mouseenter',d=>console.log(d.skills))})
//       .on("leave", (e)=>{
//         if(e.target.controller().info("scrollDirection") == "REVERSE"){}
//         else{}})
//       .addTo(controllerSkills)
//
//
// const sceneStackAllSkills = new ScrollMagic.Scene({triggerElement: ".many-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
// .on("enter", (e)=>{
//
//
//     $skillSections.at('transform',()=> 'translate('+0+','+ 2*ALL_JOBS_STARTING_Y_LOCATION +')')
//
//     $axisDifferenceRectsAllJobs
//     .at('x',d=> xScaleEuclidean(d.xCoordStacked))
//     .at('width',d=> xScaleEuclidean(d.difference))
//     .at('height',3)
//     .st('fill','#E530BE')
//     .at('transform',(d,i)=>{
//       return 'translate('+XBUMP+',0)'
//     })
//     .on('mouseenter',d=>console.log(d.skills))
//
//     $skillSectionsAllJobs.at('transform',(d,i)=>{
//       return 'translate(0,'+(i*ALL_JOBS_STARTING_Y_LOCATION+ 3*ALL_JOBS_STARTING_Y_LOCATION)+')'
//     })
// })
// .on("leave", (e)=>{
//   if(e.target.controller().info("scrollDirection") == "REVERSE"){}
//   else{}})
// .addTo(controllerSkills)