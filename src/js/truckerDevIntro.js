export default function loadtruckerDevIntro(){
  const controllerTwoJobs = new ScrollMagic.Controller();

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  const MIN_AUTOMATION = 0
  const MAX_AUTOMATION = 1

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
    .select("div.svg-container")
    .select("svg.scatter")

  chartSvg.at('height', ()=>viewportHeight/2)
    .at('width', ()=>viewportWidth* 0.8)
    .st('fill','#00000')



  const truckerDeveloperJoin = chartSvg.selectAll('circle.truckers-devs-circles')
    .data(truckersDevelopers)
    .enter()
  const truckerDeveloperCircles=truckerDeveloperJoin
    .append('circle.truckers-devs-circles')

  const truckerDeveloperSkillValues=truckerDeveloperJoin
    .append('text.two-job-skill-value')
    .text(d=>d.skillTruckerScore)

  // Set y Scale max value as just under viewport height (if viewport height/2 is height of svg)
  const svgWidth = chartSvg.at('width')
  const svgHeight = chartSvg.at('height')


// SETTING % OF SCREEN WIDTH THAT THE SVG SCALE WILL TAKE UP
  const widthPercentage = 0.9;
  const heightPercentage = 0.9;

// SETTING UP MAX SCALE VALUE AS % OF SCREEN WIDTH
  const yMaxScaleValue = svgHeight * heightPercentage;
  const xMaxScaleValue = svgWidth * widthPercentage;

// SETTING UP PADDING FOR X AND Y SCALES
  const xPadding = (1-widthPercentage)*svgWidth;
  const yPadding = (1-heightPercentage)*svgHeight;

// SETTING UP SCALES
  const yScale = d3.scaleLinear()
    .domain([MIN_AUTOMATION,MAX_AUTOMATION])
    .range([0+yPadding, yMaxScaleValue]);

  const xScale = d3.scaleLinear()
		.domain([0,100])
		.range([0+xPadding, xMaxScaleValue]);

  const introCircleXLocation = svgWidth/2;

  truckerDeveloperCircles
    .at('cx',introCircleXLocation)
    .at('cy',()=>yScale(0.5))
    .at('r', 5)
    .st('fill', d=>d.fill)
    .st('opacity',d=>d.job === 'Developers'? 0 : 1)

  const truckerDeveloperYAxisFunction = d3.axisLeft(yScale);
  const truckerDeveloperXAxisFunction = d3.axisTop(xScale);


  const HORIZONTAL_BUMP=introCircleXLocation-20;
  const truckerDeveloperYAxis = chartSvg.append("g.intro-y-axis")
    .attr("transform", "translate("+HORIZONTAL_BUMP+",0)")
    .call(truckerDeveloperYAxisFunction)
    .st('opacity',0)

  const truckerDeveloperXAxis = chartSvg.append("g.intro-x-axis")
    .attr("transform", "translate("+0+",50)")
    .call(truckerDeveloperXAxisFunction)
    .st('opacity',0)

  const $truckerCircleAutomation = d3.select('div.transition-button.trucker-circle-automatability')
  const $truckerDevAutomation = d3.select('div.transition-button.truckers-and-devs-automatability')
  const $truckerSkill = d3.select('div.transition-button.truckers-devs-trucker-skill')
  const $devSkill = d3.select('div.transition-button.truckers-devs-dev-skill')

  $truckerCircleAutomation.on('click',()=>{
    truckerDeveloperYAxis
      .transition()
      .st('opacity',1);

    truckerDeveloperCircles
      .transition()
      .at('cy',(d)=>yScale(d.automatability));
  })



// Scene: main-job-automation
// showing : automatability axis, trucker circle motion
  const sceneJob1 = new ScrollMagic.Scene({triggerElement: ".main-job-automation",offset:  0,duration: 1,triggerHook: 0})
  .on("enter", (e)=>{
    truckerDeveloperYAxis
      .transition()
      .st('opacity',1);

    truckerDeveloperCircles
      .transition()
      .at('cy',d=>yScale(d.automatability));
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    else{}})
  .addTo(controllerTwoJobs)




  $truckerDevAutomation.on('click',()=>{
    truckerDeveloperCircles
      .transition()
      .st('opacity',1)
  })



  const sceneJob2 = new ScrollMagic.Scene({
    triggerElement: ".two-jobs-automation",
    offset:  0,
    duration: 1,
    triggerHook: 0
  })
  .on("enter", (e)=>{
    truckerDeveloperCircles
      .transition()
      .st('opacity',1)
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    else{}})
  .addTo(controllerTwoJobs)




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
      .at('cx',d=> xScale(d.skillTruckerScore))
  })
  // main-job-example-skill
  const sceneJob3 = new ScrollMagic.Scene({
    triggerElement: ".main-job-example-skill",
    offset:  0,
    duration: 1,
    triggerHook: 0
  })
  .on("enter", (e)=>{
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
      .at('cx',d=> xScale(d.skillTruckerScore))

    truckerDeveloperSkillValues
      .at('x',d=> xScale(d.skillTruckerScore))
      .at('y',()=>yScale(0.5))
      .st('text-anchor','middle')
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    else{}})
  .addTo(controllerTwoJobs)


// comparison-job-example-skill
const sceneJob4 = new ScrollMagic.Scene({
  triggerElement: ".comparison-job-example-skill",
  offset:  0,
  duration: 1,
  triggerHook: 0
})
.on("enter", (e)=>{
  truckerDeveloperCircles
    .transition()
    .at('cy',()=>yScale(0.5))
    .transition()
    .at('cx',d=> xScale(d.skillDeveloperScore))

  truckerDeveloperSkillValues
    .transition()
    .text(d=>d.skillDeveloperScore)
    .st('text-anchor','middle')
    .at('x',d=> xScale(d.skillDeveloperScore))
    .at('y',()=>yScale(0.5))
})
.on("leave", (e)=>{
  if(e.target.controller().info("scrollDirection") == "REVERSE"){}
  else{}})
.addTo(controllerTwoJobs)


























  $devSkill.on('click',()=>{
    truckerDeveloperCircles
      .transition()
      .at('cy',()=>yScale(0.5))
      .transition()
      .at('cx',d=> xScale(d.skillDeveloperScore))
  })
}
