export default function loadtruckerDevIntro(){

  const CHARTWIDTH = 800
  const MIN_AUTO = 0
  const MAX_AUTO = 1

  const truckersDevelopers = [
    {'job':'Truckers',
     'automatability':0.79,
     'skillDeveloperScore':3,
     'skillDeveloperName':'Programming',
     'fill':'blue',
     'skillTruckerScore':72,
     'skillTruckerName':'Multilimb Coordination'},

     {'job':'Developers',
      'automatability':0.04,
      'skillDeveloperScore':75,
      'skillDeveloperName':'Programming',
      'fill':'magenta',
      'skillTruckerScore':0,
      'skillTruckerName':'Multilimb Coordination'}
  ]

  const chartSvg = d3.select("body")
    .append("div.svg-container")
    .append("svg.scatter")

  chartSvg.at('height', 2200)
    .at('width', CHARTWIDTH)
    .st('fill','#00000')

  const truckerDeveloperCircles = chartSvg.selectAll('circle.truckers-devs-circles')
    .data(truckersDevelopers)
    .enter()
    .append('circle.truckers-devs-circles')

  const yScale = d3.scaleLinear()
    .domain([MIN_AUTO,MAX_AUTO])
    .range([0, 600]);


  const xScale = d3.scaleLinear()
		.domain([0,100])
		.range([0, 400]);

  truckerDeveloperCircles
    .at('cx',()=>CHARTWIDTH/2)
    .at('cy',()=>yScale(0.5))
    .at('r', 5)
    .st('fill', d=>d.fill)
    .st('opacity',d=>d.job === 'Developers'? 0 : 1)

  const truckerDeveloperYAxisFunction = d3.axisLeft(yScale);
  const truckerDeveloperXAxisFunction = d3.axisTop(xScale);

  const truckerDeveloperYAxis = chartSvg.append("g.intro-y-axis")
    .attr("transform", "translate(300,0)")
    .call(truckerDeveloperYAxisFunction)
    .st('opacity',0)

  const truckerDeveloperXAxis = chartSvg.append("g.intro-x-axis")
    .attr("transform", "translate(300,50)")
    .call(truckerDeveloperXAxisFunction)
    .st('opacity',0)

  const $truckerCircleAutomation = d3.select('div.transition-button.trucker-circle-automatability')
  const $truckerDevAutomation = d3.select('div.transition-button.truckers-and-devs-automatability')
  const $truckerSkill = d3.select('div.transition-button.truckers-devs-trucker-skill')
  const $devSkill = d3.select('div.transition-button.truckers-devs-dev-skill')

  $truckerCircleAutomation.on('click',()=>{

    truckerDeveloperYAxis
      .transition()
      .st('opacity',1)

    truckerDeveloperCircles
      .transition()
      .at('cy',(d)=>yScale(d.automatability))
  })

  $truckerDevAutomation.on('click',()=>{
    truckerDeveloperCircles
      .transition()
      .st('opacity',1)
  })

  $truckerSkill.on('click',()=>{
    truckerDeveloperXAxis
      .transition()
      .st('opacity',1)

    truckerDeveloperYAxis
    .transition()
    .st('opacity',0)

    truckerDeveloperCircles
      .transition()
      .at('cy',()=>yScale(0.5))
      .transition()
      .at('cx',d=>300 + xScale(d.skillTruckerScore))

  })

  $devSkill.on('click',()=>{
    truckerDeveloperCircles
      .transition()
      .at('cy',()=>yScale(0.5))
      .transition()
      .at('cx',d=>300 + xScale(d.skillDeveloperScore))

  })

}
