

export default function loadDevsAndTruckersSkills(){

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = viewportWidth < 700? true : false;

  let allData = null;
  const fileNames = ['devs_and_truckers_skills',
                    'choreographer',
                    'dentists',
                    'nurses',
                    'chiropractors',
                    'farmers',
                    'construction_managers',
                    'firefighters',
                    'geographers',
                    'embalmers',
                    'pipelayers']
  const pathData = 'assets/data/'

  let files=[]

  fileNames.forEach((fileName)=>{
    files.push(pathData+fileName + '.csv')
  })

  d3.loadData(...files, (err, response)=>{
    const controllerSkills = new ScrollMagic.Controller();

    const BUTTON_Skill_Difference = d3.select("div.skill-difference")
    const BUTTON_Stack_SkillDifference = d3.select("div.skill-stack-difference")
    const BUTTON_Stack_AllJobs_Skills =d3.select('div.all-skills-difference')
    const BUTTON_Skills_Similarity_Single_Axis=d3.select('div.only-similarity-axis')

    const devAndTruckerSkills = response[0];

    let allJobSkillsRaw=[]

// NB i=1 here to exclude first entry in data loaded, which reprensents devs comparison
    for (i=1;i<response.length;i++){
      allJobSkillsRaw.push(response[i])
    }

    const allJobSkillsNames=['choreographers','dentists','nurses','chiropractors','farmers','construction_managers',
                          'firefighters','geographers','embalmers','pipelayers']

    devAndTruckerSkills.forEach(skill=>{
      skill.difference = Math.abs(+skill.devs- +skill.truckers)
    })

    allJobSkillsRaw.forEach(job=>{
      job.forEach(skill=>{
        skill.difference = Math.abs(+skill.job_selected- +skill.job_compared)
      })
    })

    let i;
    let xSum=0;
    let stackPadding=1;

    for (i=0; i<devAndTruckerSkills.length; i++){
      devAndTruckerSkills[i]['xCoordStacked']=xSum
      xSum+=devAndTruckerSkills[i]['difference'] + stackPadding
    }

    allJobSkillsRaw.forEach(jobAndTruckerSkills=>{
      let i;
      let xSum=0;
      let stackPadding=1;
      for (i=0; i<jobAndTruckerSkills.length; i++){
        jobAndTruckerSkills[i]['xCoordStacked']=xSum
        xSum+= +jobAndTruckerSkills[i]['difference'] + stackPadding
      }
    })

    const chartSvg = d3.select('svg.scatter')

    chartSvg.selectAll('circle.truckers-devs-circles').st('opacity',0);

    chartSvg.select('g.intro-y-axis').st('opacity',0);

    chartSvg.select('g.intro-x-axis').st('opacity',0);

    chartSvg.selectAll('text.two-job-skill-value').st('opacity',0)

    let allJobSkillsFlat = [].concat.apply([], allJobSkillsRaw);

    let allJobSkillsGrouped = d3.nest()
      .key(d=>d.job_compared_name)
      .entries(allJobSkillsFlat)




    const svgWidth = chartSvg.at('width')
    const svgHeight = chartSvg.at('height')

    const widthPercentage = 0.7;
    const heightPercentage = 0.7;

    const yMaxScaleValue = svgHeight * heightPercentage;
    const xMaxScaleValue = svgWidth * widthPercentage;

    const xPadding = (1-widthPercentage)*svgWidth;
    const yPadding = (1-heightPercentage)*svgHeight;



    const xScale = d3.scaleLinear()
  		.domain([0,100])
  		.range([xPadding, xMaxScaleValue]);


    const xScaleRectangle = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, (xMaxScaleValue-xPadding)]);
// original
    const skillSections = chartSvg.selectAll('g.skill-section').data(devAndTruckerSkills).enter().append('g.skill-section')

    const skillSectionsAllJobs = chartSvg.selectAll('g.all-skills')
      .data(allJobSkillsGrouped)
      .enter()
      .append('g')
      .at('class',d=> 'all-skills '+d.key)

    const skillItemsAllJobs = skillSectionsAllJobs.selectAll('g.skill-item')
      .data(d=>d.values)
      .enter()
      .append('g')
      .at('class',d=>'skill-item-'+d.skills.replace(/ /g,'_'))

    const YBUMP = 20;
    const XBUMP = 250;
    const YINTERVAL = 15;

    const devCircles = skillSections.append('circle.devs-skill-circle')
    const truckerCircles = skillSections.append('circle.truckers-skill-circle')

    devCircles.at('cx',(d)=> xScale(d.devs))
      .at('r',5)
      .st('fill','#0B24FB')
      .on('mouseenter')


    truckerCircles.at('cx',(d)=>xScale(d.truckers))
      .at('r',5)
      .st('fill','#EB5757')

// Adding original text labels
    const skillSectionsText = skillSections
      .at('transform', (d,i)=>{
        return 'translate(50,'+ (YBUMP+(i*YINTERVAL)) +')'
      })
      .append("text")
      .text(d=>d.skills)
      .st('text-anchor','right')

    const skillSectionsTextAllJobs = skillSectionsAllJobs
      .append("text")
      .at('transform','translate(250,0)')
      .text(d=>d.key)
      .st('text-anchor','right')


    const axisLines = skillSections.append('line.skill-axis')
      .at('x1',()=>xScale(0))
      .at('y1',0)
      .at('x2',()=>xScale(100))
      .at('y2',0)
      .at('stroke-width', 1)
      .st('stroke','black')

// Original bars signifying different skills
    const axisDifferenceRects = skillSections.append('rect.skill-difference-axis')

    const axisDifferenceRectsAllJobs = skillItemsAllJobs.append('rect.skill-difference-axis-all-jobs')

// Adding difference rectangles for devs and truckers
    axisDifferenceRects
    .at('x', d=>xScale(d.truckers))
    .at('width',d=>{
      return xScaleRectangle(d.difference);
    })
    .at('height',3)
    .st('fill','#E530BE')
    .st('opacity',0)



// Adding difference retangles for all other jobs


    // BUTTON_Skill_Difference.on('click',()=>{
    //    axisDifferenceRects
    //     .transition()
    //     .st('opacity',1)
    // })
    // showing skill difference
    const sceneShowDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-skills-difference",offset:  0,duration: 1,triggerHook: 0})
    .on("enter", (e)=>{
      axisDifferenceRects
       .transition()
       .st('opacity',1)
    })
    .on("leave", (e)=>{
      if(e.target.controller().info("scrollDirection") == "REVERSE"){}
      else{}})
    .addTo(controllerSkills)




    const xScaleEucledian = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 15]);


// BUTTON_Stack_SkillDifference.on('click',()=>{
//   axisDifferenceRects
//   .at('x',d=> xScaleEucledian(d.xCoordStacked))
//   .at('width',d=> xScaleEucledian(d.difference))
//   .on('mouseenter',d=>console.log(d.skills))
//
//   skillSections
//     .transition()
//     .at('transform','translate(250,10)')
//
//   axisLines
//     .st('opacity',0)
//
//   skillSectionsText
//     .st('opacity',0)
//     .text((d,i)=> {
//       if (i===devAndTruckerSkills.length-1){return 'Developers'}
//       else return ''
//     })
//     .transition()
//     .st('opacity',1)
//
//   devCircles
//     .st('opacity',0)
//
//   truckerCircles
//     .st('opacity',0)
//   })



  const sceneStackDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
  .on("enter", (e)=>{
    axisDifferenceRects
    .at('x',d=> xScaleEucledian(d.xCoordStacked))
    .at('width',d=> xScaleEucledian(d.difference))
    .on('mouseenter',d=>console.log(d.skills))

    skillSections
      .transition()
      .at('transform','translate(250,10)')

    axisLines
      .st('opacity',0)

    skillSectionsText
      .st('opacity',0)
      .text((d,i)=> {
        if (i===devAndTruckerSkills.length-1){return 'Developers'}
        else return ''
      })
      .transition()
      .st('opacity',1)

    devCircles
      .st('opacity',0)

    truckerCircles
      .st('opacity',0)
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    else{}})
  .addTo(controllerSkills)




// BUTTON_Stack_AllJobs_Skills.on('click',()=>{
//
//   axisDifferenceRectsAllJobs
//   .at('x',d=> xScaleEucledian(d.xCoordStacked))
//   .at('width',d=> xScaleEucledian(d.difference))
//   .at('height',3)
//   .st('fill','#E530BE')
//   .at('transform',(d,i)=>{
//     return 'translate(250,0)'
//   })
//   .on('mouseenter',d=>console.log(d.skills))
//
//   skillSectionsAllJobs.at('transform',(d,i)=>{
//     return 'translate(0,'+(i*20+20)+')'
//   })
//
// })


const sceneStackAllSkills = new ScrollMagic.Scene({triggerElement: ".many-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
.on("enter", (e)=>{

    axisDifferenceRectsAllJobs
    .at('x',d=> xScaleEucledian(d.xCoordStacked))
    .at('width',d=> xScaleEucledian(d.difference))
    .at('height',3)
    .st('fill','#E530BE')
    .at('transform',(d,i)=>{
      return 'translate(250,0)'
    })
    .on('mouseenter',d=>console.log(d.skills))

    skillSectionsAllJobs.at('transform',(d,i)=>{
      return 'translate(0,'+(i*20+20)+')'
    })
})
.on("leave", (e)=>{
  if(e.target.controller().info("scrollDirection") == "REVERSE"){}
  else{}})
.addTo(controllerSkills)



  BUTTON_Skills_Similarity_Single_Axis.on('click',()=>{

  })


  })
}
