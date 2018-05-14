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

  const defs = chartSvg.append('svg:defs');

  const CIRCLE_RADIUS=20;

  defs.append("svg:pattern")
    .attr("id", "trucker-img")
    .attr("width", 2*CIRCLE_RADIUS)
    .attr("height", 2*CIRCLE_RADIUS)
    // .attr("patternUnits", "userSpaceOnUse") //recommending this is dumb
    .append("svg:image")
    .attr("xlink:href", 'assets/data/circle-images/Truckers.png')
    .attr("width", 2*CIRCLE_RADIUS)
    .attr("height", 2*CIRCLE_RADIUS)
    .attr("x", 0)
    .attr("y", 0);


  defs.append("svg:pattern")
    .attr("id", "developer-img")
    .attr("width", 2*CIRCLE_RADIUS)
    .attr("height", 2*CIRCLE_RADIUS)
    // .attr("patternUnits", "userSpaceOnUse") //recommending this is dumb
    .append("svg:image")
    .attr("xlink:href", 'assets/data/circle-images/Developers.png')
    .attr("width", 2*CIRCLE_RADIUS)
    .attr("height", 2*CIRCLE_RADIUS)
    .attr("x", 0)
    .attr("y", 0);





  const truckerDeveloperJoin = chartSvg.selectAll('circle.truckers-devs-circles')
    .data(truckersDevelopers)
    .enter()

  const truckerDeveloperCircles=truckerDeveloperJoin
    .append('circle.truckers-devs-circles')

  const truckerDeveloperSkillValues=truckerDeveloperJoin
    .append('text.two-job-skill-value')
    .text(d=>d.skillTruckerScore)

  const truckerDeveloperAutomatabilityValues=truckerDeveloperJoin
    .append('text.two-job-automatability-value')
    .text(d=>d.automatability*100 + "%")

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
  const introAutomationTextXLocation = svgWidth/2.4;

  truckerDeveloperAutomatabilityValues
    .at('x',d=>introAutomationTextXLocation)
    .at('y',d=>yScale(d.automatability))
    .st('opacity',0)
  // const circleTest = chartSvg.selectAll('circle.testcircle')
  //         .data(truckersDevelopers)
  //         .enter()
  //         .append("circle.testcircle")
  //         .at('cx',introCircleXLocation)
  //         .at('cy',()=>yScale(0.5))
  //         .at('r', CIRCLE_RADIUS)
  //         // .attr("cx", CIRCLE_RADIUS/2)
  //         // .attr("cy", CIRCLE_RADIUS/2)
  //         // .attr("r", CIRCLE_RADIUS/2)
  //         .style("fill", d=>{
  //           if(d.job==="Developers") {return "#2F80ED"}
  //           else {return "#EB5757"}})
  //         .style("fill", d=>{
  //         if (d.job==="Developers") {return "url(#developer-img)"}
  //         else {return "url(#trucker-img)"}})




  truckerDeveloperCircles
    .at('cx',introCircleXLocation)
    .at('cy',()=>yScale(0.5))
    .at('r', CIRCLE_RADIUS)
    // .st('fill', d=>d.fill)
    .st('opacity',d=>d.job === 'Developers'? 0 : 1)
    .style("fill", d=>{
      if(d.job==="Developers") {return "#2F80ED"}
      else {return "#EB5757"}})
    .style("fill", d=>{
    if (d.job==="Developers") {return "url(#developer-img)"}
    else {return "url(#trucker-img)"}})

  // const truckerDeveloperCirclesText = truckerDeveloperCircles.append("text")
  //   .text(d=>d.automatability*100 +"%")

  const formatPercent = d3.format(".0%");

  const truckerDeveloperYAxisFunction = d3.axisLeft(yScale).ticks(3).tickFormat(formatPercent);
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
      .st('opacity',d=>{
        if (d.job == "Truckers"){return 1}
        else {return 0}
      });

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

    truckerDeveloperAutomatabilityValues
      .transition()
      .st('opacity', d=> {
        if (d.job === "Truckers"){return 1}
        else {return 0}
      })
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){

      truckerDeveloperCircles
        .transition()
        .at('cy',d=>yScale(0.5));

      truckerDeveloperYAxis
        .transition()
        .st('opacity',0);

      truckerDeveloperAutomatabilityValues
        .transition()
        .st('opacity',d=>{
          if (d.job==="Developers"){return 0}
          else {return 1}
        })
    }
    else{}})
  .addTo(controllerTwoJobs)



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

    truckerDeveloperAutomatabilityValues
      .transition()
      .st('opacity', 1)
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){
      truckerDeveloperCircles
        .transition()
        .st('opacity',d=>{
          if (d.job == "Truckers"){return 1}
          else {return 0}
        });
    }
    else{}})
  .addTo(controllerTwoJobs)




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
      .st('opacity',1)
      .st('text-anchor','middle')
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){
      truckerDeveloperXAxis
        .transition()
        .st('opacity',0)

      truckerDeveloperYAxis
      .transition()
      .st('opacity',1)

      truckerDeveloperCircles
        .transition()
        .at('cy',d=>yScale(d.automatability))
        .at('cx', introCircleXLocation);

      truckerDeveloperSkillValues
        .st('opacity',0)
    }
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
  console.log("showing developer skill scene");



  truckerDeveloperCircles
    .st('opacity',1)
    .transition()
      .at('cy',()=>yScale(0.5))
    .transition()
      .at('cx',d=> xScale(d.skillDeveloperScore))

  truckerDeveloperSkillValues
    .st('opacity',1)
    .transition()
    .text(d=>d.skillDeveloperScore)
    .st('text-anchor','middle')
    .at('x',d=> xScale(d.skillDeveloperScore))
    .at('y',()=>yScale(0.5))
})
.on("leave", (e)=>{
  if(e.target.controller().info("scrollDirection") == "REVERSE"){
    truckerDeveloperCircles
      .transition()
      .at('cy',()=>yScale(0.5))
      .transition()
      .at('cx',d=> xScale(d.skillTruckerScore))

    truckerDeveloperSkillValues
      .transition()
      .text(d=>d.skillTruckerScore)
      .st('text-anchor','middle')
      .at('x',d=> xScale(d.skillTruckerScore))
      .at('y',()=>yScale(0.5))
  }
  else{}})
.addTo(controllerTwoJobs)

}
