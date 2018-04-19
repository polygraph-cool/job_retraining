

export default function loadDevsAndTruckersSkills(){
  let allData = null;
  const fileNames = ['devs_and_truckers_skills']
  const pathData = 'assets/data/'

  let files=[]

  fileNames.forEach((fileName)=>{
    files.push(pathData+fileName + '.csv')
  })

  d3.loadData(...files, (err, response)=>{

    const BUTTON_Skill_Difference = d3.select("div.skill-difference")
    const BUTTON_Stack_SkillDifference = d3.select("div.skill-stack-difference")

    const devAndTruckerSkills = response[0];

    const chartSvg = d3.select("body")
      .append("div.svg-container")
      .append("svg.scatter")

    chartSvg.at('height', 2200)
      .at('width', 800)
      .st('fill','#00000')

    const xScale = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 400]);

    const skillSections = chartSvg.selectAll('g.skill-section')
      .data(devAndTruckerSkills)
      .enter()
      .append('g.skill-section')


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

    const axisDifferenceLines = skillSections.append('line.skill-difference-axis')

    axisDifferenceLines
    .at('x1',d=> XBUMP + xScale(d.truckers))
    .at('y1',0)
    .at('x2',d=> XBUMP + xScale(d.devs))
    .at('y2',0)
    .at('stroke-width', 3)
    .st('stroke','#E530BE')
    .at('opacity',0)


    BUTTON_Skill_Difference.on('click',()=>{
       axisDifferenceLines
        .transition()
        .at('opacity',1)
    })

    const xScaleEucledian = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, 20]);


BUTTON_Stack_SkillDifference.on('click',()=>{
  axisDifferenceLines
    .at('x1',d=> XBUMP + xScaleEucledian(d.truckers))
    .at('x2',d=> XBUMP + xScaleEucledian(d.devs))

  skillSections
    .at('transform','translate(50,10)')

  axisLines
    .at('opacity',0)

  skillSectionsText
    .at('opacity',0)

  devCircles
    .at('opacity',0)

  truckerCircles
    .at('opacity',0)

  d3.select('svg.scatter')
    .at('height',0)
    .at('width',0)
})

  })
}
