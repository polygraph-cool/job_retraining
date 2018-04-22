

export default function loadDevsAndTruckersSkills(){
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

    const BUTTON_Skill_Difference = d3.select("div.skill-difference")
    const BUTTON_Stack_SkillDifference = d3.select("div.skill-stack-difference")
    const BUTTON_Stack_AllJobs_Skills =d3.select('div.all-skills-difference')

    const devAndTruckerSkills = response[0];

    let allJobSkillsRaw=[]

// NB i=1 here to exclude first entry in data loaded, which reprensents devs comparison
    for (i=1;i<response.length;i++){
      allJobSkillsRaw.push(response[i])
    }

    // const choreographers = response[1]
    // const dentists = response[2]
    // const nurses = response[3]
    // const chiropractors = response[4]
    // const farmers = response[5]
    // const construction_managers = response[6]
    // const firefighters = response[7]
    // const geographers = response[8]
    // const embalmers = response[9]
    // const pipelayers = response[10]
    // const allProfessionSkills = response[11];

    // const allJobSkills = [choreographers,dentists,nurses,chiropractors,farmers,construction_managers,
    //                       firefighters,geographers,embalmers,pipelayers]
    const allJobSkillsNames=['choreographers','dentists','nurses','chiropractors','farmers','construction_managers',
                          'firefighters','geographers','embalmers','pipelayers']

    // const allJobSkillsNamesObjects=[
    //   [{'name':'choreographers'}],
    //   [{'name':'dentists'}],
    //   [{'name':'nurses'}],
    //   [{'name':'chiropractors'}],
    //   [{'name':'farmers'}],
    //   [{'name':'construction_managers'}],
    //   [{'name':'firefighters'}],
    //   [{'name':'geographers'}],
    //   [{'name':'embalmers'}],
    //   [{'name':'pipelayers'}]
    // ]

    devAndTruckerSkills.forEach(skill=>{
      skill.difference = Math.abs(+skill.devs- +skill.truckers)
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

    let allJobSkillsFlat = [].concat.apply([], allJobSkillsRaw);

    let allJobSkillsGrouped = d3.nest()
      .key(d=>d.job_compared_name)
      .entries(allJobSkillsFlat)

    // console.log(allJobSkills);


    const chartSvg = d3.select("body")
      .append("div.svg-container")
      .append("svg.scatter")

    chartSvg.at('height', 2200)
      .at('width', 800)
      .st('fill','#00000')

    const xScale = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 400]);
// original
    const skillSections = chartSvg.selectAll('g.skill-section').data(devAndTruckerSkills).enter().append('g.skill-section')

    const skillSectionsAllJobs = chartSvg.selectAll('g.all-skills')
      .data(allJobSkillsGrouped)
      .enter()
      .append('g')
      .at('class',d=> 'all-skills-'+d.key)

    const skillItemsAllJobs = skillSectionsAllJobs.selectAll('g.skill-item')
      .data(d=>d.values)
      .enter()
      .append('g')
      .at('class',d=>'skill-item-'+d.skills.replace(/ /g,'_'))



// Creating group elements tied to data from multiple jobs
    // let jobSkillGroupObject={}
    // for(i=0; i<allJobSkillsNames.length; i++){
    //   jobSkillGroupObject[`${allJobSkillsNames[i]}`]=chartSvg.selectAll(`g.skill-section-${allJobSkillsNames[i]}`)
    //   .data(allJobSkills[i])
    //   .enter()
    //   .append(`g.skill-section-${allJobSkillsNames[i]}`)
    // }


    const YBUMP = 20;
    const XBUMP = 250;
    const YINTERVAL = 15;

    const devCircles = skillSections.append('circle.devs-skill-circle')
    const truckerCircles = skillSections.append('circle.truckers-skill-circle')

    devCircles.at('cx',(d)=> XBUMP+ xScale(d.devs))
      .at('r',5)
      .st('fill','#0B24FB')
      .on('mouseenter')


    truckerCircles.at('cx',(d)=>XBUMP+ xScale(d.truckers))
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


// Adding other text labels
    // let allJobLabels = {}
    // for(i=0; i<allJobSkillsNames.length; i++){
    //   allJobLabels[`${allJobSkillsNames[i]}`]=jobSkillGroupObject[allJobSkillsNames[i]].select(`text.all-jobs.job-${allJobSkillsNames[i]}`)
    //   .data(allJobSkillsNamesObjects[i])
    //   .enter()
    //   .append(`text.all-jobs.job-${allJobSkillsNames[i]}`)
    // }


    const axisLines = skillSections.append('line.skill-axis')
      .at('x1',200)
      .at('y1',0)
      .at('x2',800)
      .at('y2',0)
      .at('stroke-width', 1)
      .st('stroke','black')

// Original bars signifying different skills
    const axisDifferenceRects = skillSections.append('rect.skill-difference-axis')

    const axisDifferenceRectsAllJobs = skillItemsAllJobs.append('rect.skill-difference-axis-all-jobs')

// Looping through array of data to create, for each job, bars signifying different skills
    // let jobSkillGroupDifferenceRects={}
    // for(i=0; i<allJobSkillsNames.length; i++){
    //   jobSkillGroupDifferenceRects[`${allJobSkillsNames[i]}`]=jobSkillGroupObject[allJobSkillsNames[i]].append(`rect.other-job-skills.skill-difference-axis-${allJobSkillsNames[i]}`)
    // }


// Adding difference rectangles for devs and truckers
    axisDifferenceRects
    .at('x', d=>XBUMP+xScale(d.truckers))
    .at('width',d=> xScale(d.difference))
    .at('height',3)
    .st('fill','#E530BE')
    .st('opacity',0)

// Adding difference retangles for all other jobs

    // for(i=0; i<allJobSkillsNames.length; i++){
    //   jobSkillGroupDifferenceRects[allJobSkillsNames[i]]
    //   .at('x', d=>XBUMP+xScale(d.job_selected))
    //   .at('width',d=> xScale(d.difference))
    //   .at('height',3)
    //   .st('fill','#E530BE')
    //   .st('opacity',0)
    // }


    BUTTON_Skill_Difference.on('click',()=>{
       axisDifferenceRects
        .transition()
        .st('opacity',1)
    })

    const xScaleEucledian = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 15]);


BUTTON_Stack_SkillDifference.on('click',()=>{
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

BUTTON_Stack_AllJobs_Skills.on('click',()=>{

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

//   d3.selectAll('rect.other-job-skills').st('opacity',1)
//
//   let yDistanceFromTop = 0
//
//   for(i=0; i<allJobSkillsNames.length; i++){
//
//     yDistanceFromTop=i*20+20;
//
//     jobSkillGroupDifferenceRects[allJobSkillsNames[i]]
//       .at('x', d=>XBUMP+xScaleEucledian(d.xCoordStacked))
//       .at('width',d=> xScaleEucledian(d.difference))
//       .at('height',3)
//       .transition()
//       .at('transform',`translate(0,${yDistanceFromTop})`)
//       .st('fill','#E530BE')
//       .st('opacity',1)
//
//     //Adding labels
//      allJobLabels[allJobSkillsNames[i]]
//       .at('transform',`translate(50,${yDistanceFromTop})`)
//       .st('opacity',1)
//       .text(d => d.name)
//   }
})


  })
}
