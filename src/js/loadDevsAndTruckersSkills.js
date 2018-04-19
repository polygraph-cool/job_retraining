

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

    const choreographers = response[1]
    const dentists = response[2]
    const nurses = response[3]
    const chiropractors = response[4]
    const farmers = response[5]
    const construction_managers = response[6]
    const firefighters = response[7]
    const geographers = response[8]
    const embalmers = response[9]
    const pipelayers = response[10]
    const allProfessionSkills = response[11];

    const allJobSkills = [choreographers,dentists,nurses,chiropractors,farmers,construction_managers,
                          firefighters,geographers,embalmers,pipelayers]

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

    allJobSkills.forEach(jobAndTruckerSkills=>{
      let i;
      let xSum=0;
      let stackPadding=1;
      for (i=0; i<jobAndTruckerSkills.length; i++){
        jobAndTruckerSkills[i]['xCoordStacked']=xSum
        xSum+= +jobAndTruckerSkills[i]['difference'] + stackPadding
      }
    })

    console.log(allJobSkills);


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
    const skillSections = chartSvg.selectAll('g.skill-section')
      .data(devAndTruckerSkills)
      .enter()
      .append('g.skill-section')

      // new
      // choreographers,dentists,nurses,chiropractors,farmers,construction_managers,firefighters,geographers,embalmers,pipelayers
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsDentists = chartSvg.selectAll('g.skill-section-dentists').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsNurses = chartSvg.selectAll('g.skill-section-nurses').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChiropractors = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')
    // const skillSectionsChoreographers = chartSvg.selectAll('g.skill-section-choreographers').data(devAndTruckerSkills).enter().append('g.skill-section-choreographers')


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

    const skillSectionsText = skillSections
    .at('transform', (d,i)=>{
      return 'translate(50,'+ (YBUMP+(i*YINTERVAL)) +')'
    })
    .append("text")
    .text(d=>d.skills)
    .st('text-anchor','right')


    const axisLines = skillSections.append('line.skill-axis')
      .at('x1',200)
      .at('y1',0)
      .at('x2',800)
      .at('y2',0)
      .at('stroke-width', 1)
      .st('stroke','black')

    const axisDifferenceRects = skillSections.append('rect.skill-difference-axis')

    axisDifferenceRects
    .at('x', d=>XBUMP+xScale(d.truckers))
    .at('width',d=> xScale(d.difference))
    .at('height',3)
    .st('fill','#E530BE')
    .st('opacity',0)

    // axisDifferenceLines
    // .at('x1',d=> XBUMP + xScale(d.truckers))
    // .at('y1',0)
    // .at('x2',d=> XBUMP + xScale(d.devs))
    // .at('y2',0)
    // .at('stroke-width', 3)
    // .st('stroke','#E530BE')
    // .st('opacity',0)


    BUTTON_Skill_Difference.on('click',()=>{
       axisDifferenceRects
        .transition()
        .st('opacity',1)
    })

    const xScaleEucledian = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 20]);


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
  console.log("HELLO");
})


  })
}
