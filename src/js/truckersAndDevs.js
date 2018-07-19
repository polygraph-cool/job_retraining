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
  'skillTruckerName':'Multilimb Coordination'},
 {'job':'Elementary school teachers',
  'automatability':0,
  'skillDeveloperScore':'',
  'skillDeveloperName':'',
  'fill':'',
  'skillTruckerScore':'',
  'skillTruckerName':''},
  {'job':'Telemarketers',
  'automatability':1,
  'skillDeveloperScore':'',
  'skillDeveloperName':'',
  'fill':'',
  'skillTruckerScore':'',
  'skillTruckerName':''}
]

let svgWidth = null;
let svgHeight = null;

let widthPercentage  = null;
let heightPercentage = null;

const $chartContainer = d3.select("body")
  .select("figure.svg-container")

const $chartSvg = $chartContainer
  .select("svg.scatter")

const MIN_AUTOMATION = 0
const MAX_AUTOMATION = 1
const CIRCLE_RADIUS = 20;
const INIT_X_AXIS_PLACEMENT = 50;

let viewportWidth =  null;
let viewportHeight = null;

let yAxisLabelMin = null;
let truckerDeveloperYAxis = null;
let introYAxisLocation = null;
let scalesObject = {}

let yMaxScaleValue = null;
let xMaxScaleValue = null;

let xPadding = null;
let yPadding = null;

let $jobCircles = null;
let jobsGroups = null;
let $automatability_LABEL = null;
let $truckerDeveloperXAxis = null;
let jobsName_LABELS = null;
let jobNameLabel_margin_x = null;
let jobCircle_margin_x = null;
let jobNameLabel_margin_y = null;

function setupCirclePatterns(data){

  const $defs = $chartSvg.append('defs');
  const patternsJoin = $defs
    .selectAll('pattern')
    .data(data)
    .enter()

  const $patterns = patternsJoin
    .append('pattern')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at('id',d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_')
      return jobNameNoSpaces+'-img'
    })

  const $patternsImages=$patterns
    .append('image')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at("x",0)
    .at("y",0)
    .at("xlink:href",d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_');
      return 'assets/data/circle-images/'+jobNameNoSpaces+'.png'
    })

}

function resize(){
  svgWidth = $chartSvg.at('width')
  svgHeight = $chartSvg.at('height')

  // console.log($chartSvg.at('width'));

  // console.log($('figure').height());

  viewportWidth =window.innerWidth;
  viewportHeight=window.innerHeight;

  widthPercentage = 0.9;
  heightPercentage = 0.8;

  console.log("resize!");
}

function setupScales(){

  const heightMiscElDiv = document.getElementById('misc-chart-elements-container').offsetHeight;
  const svgMaxSize = viewportHeight-heightMiscElDiv;

  yMaxScaleValue = svgMaxSize * heightPercentage;
  xMaxScaleValue = svgWidth * widthPercentage;

  xPadding = (1-widthPercentage)*svgWidth;
  yPadding = (1-heightPercentage)*svgHeight;

  scalesObject.yScale = d3.scaleLinear()
    .domain([MIN_AUTOMATION,MAX_AUTOMATION])
    .range([0+yPadding, yMaxScaleValue]);

  scalesObject.xScale = d3.scaleLinear()
		.domain([0,100])
		.range([0+xPadding, xMaxScaleValue]);

  introYAxisLocation = svgWidth/2;

}

function setupAxes(){
  yAxisLabelMin = $chartSvg.append('text.y-axis-label.min')
    .at('x',introYAxisLocation)
    .at('y',yPadding/2)
    .st('fill', '#2F80ED')
    .st('text-anchor','middle')
    .text('FUTURE-PROOF JOBS' )

  const yAxisLabelMax = $chartSvg.append('text.y-axis-label.max')
    .at('x',introYAxisLocation)
    .at('y',yMaxScaleValue+(yPadding/2))
    .st('fill', '#EB5757')
    .st('text-anchor','middle')
    .text('🤖 WILL TAKE THESE JOBS')

  const formatPercent = d3.format(".0%");
  const formatPercentv2 = d3.format("d");

  const truckerDeveloperYAxisFunction = d3.axisLeft(scalesObject.yScale).ticks(1).tickFormat(formatPercent);
  const truckerDeveloperXAxisFunction = d3.axisTop(scalesObject.xScale).ticks(1).tickFormat(formatPercentv2);

  const HORIZONTAL_BUMP=introYAxisLocation;

  truckerDeveloperYAxis = $chartSvg.append("g.intro-y-axis")
    .attr("transform", "translate("+HORIZONTAL_BUMP+",0)")
    .call(truckerDeveloperYAxisFunction)
    .st('opacity',1)

  $truckerDeveloperXAxis = $chartSvg.append("g.intro-x-axis")
    .attr("transform", "translate("+0+","+INIT_X_AXIS_PLACEMENT+")")
    .call(truckerDeveloperXAxisFunction)
    .st('opacity',0)

}

function setupDOMElements(){

  setupAxes()

  const truckerDeveloperJoin = $chartSvg.selectAll('circle.jobs-circles')
    .data(truckersDevelopers)
    .enter()

  jobsGroups = truckerDeveloperJoin
    .append('g.trucker-developer-groups')

  $jobCircles = jobsGroups.append('circle.intro-jobs-circles')
  const jobsAutomatability_LABELS = jobsGroups.append('text.intro-automatability-values')
  jobsName_LABELS = jobsGroups.append('text.intro-job-names')
  const jobsSkills_LABELS = jobsGroups.append('text.intro-job-skill-values')

  $automatability_LABEL = $chartSvg.append('text.automatability-label')
// adding element text labels

  jobsAutomatability_LABELS.text(d=>d.automatability*100 + "%")
  jobsName_LABELS.text(d=>d.job)
  jobsSkills_LABELS.text(d=>d.skillTruckerScore)
  $automatability_LABEL.text('automation likelihood')

  //setting initial opacity
  jobsGroups
    .at('transform', d=>{
      return 'translate('+introYAxisLocation+','+
                         +scalesObject.yScale(d.automatability)+')'
    })
    .st('opacity',d=> {
      if (d.job==="Elementary school teachers" || d.job==="Telemarketers"){return 1}
      else {return 0}
    })
    // .st('opacity', 1)

  // jobsAutomatability_LABELS
    // .st('opacity',d=> {
    //     if (d.job==="Elementary school teachers" || d.job==="Telemarketers"){return 0}
    //     else {return 1}
    //   })
    // .st('opacity',1)

  jobsSkills_LABELS
    .st('opacity',0)



  // INITIAL ELEMENT POSITIONING AND OPACITY SETTING

  jobCircle_margin_x = CIRCLE_RADIUS*2;
  jobNameLabel_margin_x = CIRCLE_RADIUS*4;
  jobNameLabel_margin_y = jobCircle_margin_x/10;

  $jobCircles
    .at('cx',jobCircle_margin_x)
    .at('r', CIRCLE_RADIUS)
    // .st('opacity',d=>d.job === 'Developers'? 0 : 1)
    .st('fill','#2F80ED')
    .st('fill', d=>{
      const jobNameNoSpaces = d.job.replace(/ /g,'_');
      return `url(#${jobNameNoSpaces}-img)`
    })

  jobsName_LABELS
    .at('x',jobNameLabel_margin_x)
    .at('y',jobNameLabel_margin_y)
    .st('text-anchor','right')

  jobsAutomatability_LABELS
    .at('x',-jobCircle_margin_x)
    .at('y',jobNameLabel_margin_y)
    .st('text-anchor','left')

  $automatability_LABEL
    .at('transform','translate('+introYAxisLocation+','+(svgHeight/2)+')')
    .st('opacity',1)

}

function updateStep(step){
  if(step==='all-automation'){
      jobsGroups
        .transition()
        .st('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 0 : 1)

      $chartSvg.select('g.intro-y-axis')
        .selectAll('g.tick')
        .selectAll('text')
        .transition()
        .st('opacity', '0')
  }
  else if(step==='main-job-circle'){
      jobsGroups
        .transition()
        .st('opacity', d=>d.job==='Truckers'? 1 : 0)

      $chartSvg.select('g.intro-y-axis')
        .selectAll('g.tick')
        .selectAll('text')
        .transition()
        .st('opacity', '1')
  }
  else if(step==='main-job-automation'){

    jobsName_LABELS
      .at('x',jobNameLabel_margin_x)
      .at('y',jobNameLabel_margin_y)
      .st('text-anchor','right')

    $chartSvg
      .selectAll('text.y-axis-label')
      .transition()
      .st('opacity',1)

    $chartSvg
      .selectAll('.intro-automatability-values')
      .transition()
      .st('opacity',1)

    $truckerDeveloperXAxis
      .transition()
      .st('opacity',0)
      .at('transform',()=>{
        return 'translate(0,'+ INIT_X_AXIS_PLACEMENT+')'
      })


      $chartSvg.st('display', 'block')
      truckerDeveloperYAxis.st('opacity',1)

      jobsGroups
        .transition()
        .st('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 1 : 0)
        .at('transform', d=>{
          return 'translate('+introYAxisLocation+','+
                             +scalesObject.yScale(d.automatability)+')'
        })

      $chartContainer
        .select('img.images-two-jobs-two-skills')
        .st('display','none')
  }
  else if(step ==='images-two-jobs-two-skills-developers'){

      jobsName_LABELS
        .at('x',0)
        .at('y',jobCircle_margin_x)
        .st('text-anchor','start')

      $chartSvg
        .selectAll('.skill-section__two-jobs')
        .transition()
        .st('opacity',0)

      const middleCoord = scalesObject.yScale(0.5);

      $chartSvg
        .selectAll('text.y-axis-label')
        .transition()
        .st('opacity',0)

      $chartSvg
        .selectAll('.intro-automatability-values')
        .transition()
        .st('opacity',0)

      $truckerDeveloperXAxis
        .transition()
        .st('opacity',1)
        .at('transform',()=>{
          return 'translate(0,'+ middleCoord+')'
        })

      truckerDeveloperYAxis
      .transition()
      .st('opacity',0)

      jobsGroups
      .transition()
      .at('transform',d=>{
        return 'translate('+scalesObject.xScale(d.skillTruckerScore)+','+middleCoord +')'
      })
      .st('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 1 : 0)

      $chartSvg
        .selectAll('g.skill-section')
        .transition()
        .st('opacity',0)

  }
  else if(step==='images-two-jobs-two-skills'){

      // $chartSvg.st('display', 'none')
      // jobsGroups.st('opacity',0)
      // truckerDeveloperYAxis.st('opacity',0)
      // yAxisLabelMin.st('opacity',0)
      //
      // $chartContainer
      //   .select('img.images-two-jobs-many-skills')
      //   .st('display','none')
      //
      // const $staticImageDiv = $chartContainer
      //   .select('img.images-two-jobs-two-skills')
      //
      // $staticImageDiv
      //   .st('display','block')
      //   .st('visibility','visible')


      const middleCoord = scalesObject.yScale(0.5);

      $chartSvg
        .selectAll('text.y-axis-label')
        .transition()
        .st('opacity',0)

      $chartSvg
        .selectAll('.intro-automatability-values')
        .transition()
        .st('opacity',0)


      $truckerDeveloperXAxis
        .transition()
        .st('opacity',1)
        .at('transform',()=>{
          return 'translate(0,'+ middleCoord+')'
        })

      truckerDeveloperYAxis
      .transition()
      .st('opacity',0)


      jobsGroups
      .transition()
      .at('transform',d=>{
        return 'translate('+scalesObject.xScale(d.skillTruckerScore)+','+middleCoord +')'
      })

      // .at('y',()=>scalesObject.yScale(0.5))
      // .transition()
      // .at('x',d=> scalesObject.xScale(d.skillTruckerScore))




      // $jobCircles
      //   .transition()
      //   .at('cy',()=>scalesObject.yScale(0.5))
      //   .transition()
      //   .at('cx',d=> scalesObject.xScale(d.skillTruckerScore))

      // truckerDeveloperSkillValues
      //   .at('x',d=> scalesObject.xScale(d.skillTruckerScore))
      //   .at('y',()=>scalesObject.yScale(0.5))
      //   .st('opacity',1)
      //   .st('text-anchor','middle')

  }
  else if(step==='images-two-jobs-many-skills'){
      $chartContainer
        .select('img.images-two-jobs-two-skills')
        .st('display','none')

      $chartContainer
        .select('img.images-two-jobs-stacked-skills')
        .st('display','none')

       const $staticImageDiv = $chartContainer
        .select('img.images-two-jobs-many-skills')

      $staticImageDiv
        .st('display','block')
        .st('visibility','visible')
  }
  // else if(step==='images-two-jobs-stacked-skills'){
  //     $chartContainer
  //       .select('img.images-two-jobs-many-skills')
  //       .st('display','none')
  //
  //     $chartContainer
  //       .select('img.images-many-jobs-many-skills')
  //       .st('display','none')
  //
  //      const $staticImageDiv = $chartContainer
  //       .select('img.images-two-jobs-stacked-skills')
  //
  //     $staticImageDiv
  //       .st('display','block')
  //       .st('visibility','visible')
  // }
  // else if(step==='images-many-jobs-many-skills'){
  //
  //     $chartSvg.selectAll('circle.job')
  //       .classed('invisible', true)
  //
  //     $chartSvg.selectAll('g.similarity-annotation')
  //       .classed('invisible', true)
  //
  //     $chartContainer
  //       .select('img.images-two-jobs-stacked-skills')
  //       .st('display','none')
  //
  //      const $staticImageDiv = $chartContainer
  //       .select('img.images-many-jobs-many-skills')
  //
  //     $staticImageDiv
  //       .st('display','block')
  //       .st('visibility','visible')
  //
  //     $chartSvg
  //   		.selectAll('.axis-label')
  //       .st('opacity',0)
  // }
}

function init(){

  return new Promise((resolve, reject) =>{

    setupCirclePatterns(truckersDevelopers)
    resize()
    setupScales()
    setupDOMElements()

    resolve()

  })
}




// const sceneTruckerOnly = new ScrollMagic.Scene({triggerElement: ".main-job-circle",offset:  0,duration: 1,triggerHook: 100})
// .on("enter", (e)=>{
//
//   $jobCircles
//     .st('opacity',1);
//
//   jobsGroups
//     .transition()
//     .st('opacity', d=>d.job==='Truckers'? 1 : 0)
//
//   $automatability_LABEL
//     .st('opacity',1)
//
// })
// .on("leave", (e)=>{
//   if(e.target.controller().info("scrollDirection") == "REVERSE"){
//
//     $jobCircles
//       .transition()
//       .at('cy',d=>yScale(0.5));
//
//     truckerDeveloperYAxis
//       .transition()
//       .st('opacity',0);
//
//     truckerDeveloperAutomatabilityValues
//       .transition()
//       .st('opacity',0)
//   }
//   else{}})
// .addTo(controllerTwoJobs)
//
//
//   const sceneJob1 = new ScrollMagic.Scene({triggerElement: ".main-job-automation",offset:  0,duration: 1,triggerHook: 100})
//   .on("enter", (e)=>{
//
//     jobsGroups
//       .transition()
//       .st('opacity', d=>d.skillTruckerScore===''? 0 : 1)
//   })
//   .on("leave", (e)=>{
//     if(e.target.controller().info("scrollDirection") == "REVERSE"){
//
//       $jobCircles
//         .transition()
//         .at('cy',d=>yScale(0.5));
//
//       truckerDeveloperYAxis
//         .transition()
//         .st('opacity',0);
//
//       truckerDeveloperAutomatabilityValues
//         .transition()
//         .st('opacity',0)
//     }
//     else{}})
//   .addTo(controllerTwoJobs)
//
//
//   const sceneJob3 = new ScrollMagic.Scene({
//     triggerElement: ".main-job-example-skill",
//     offset:  0,
//     duration: 1,
//     triggerHook: 0
//   })
//   .on("enter", (e)=>{
//
//     truckerDeveloperAutomatabilityValues
//       .transition()
//       .st('opacity',0)
//
//     truckerDeveloperXAxis
//       .transition()
//       .st('opacity',1)
//
//     truckerDeveloperYAxis
//     .transition()
//     .st('opacity',0)
//
//     $jobCircles
//       .transition()
//       .at('cy',()=>yScale(0.5))
//       .transition()
//       .at('cx',d=> xScale(d.skillTruckerScore))
//
//     truckerDeveloperSkillValues
//       .at('x',d=> xScale(d.skillTruckerScore))
//       .at('y',()=>yScale(0.5))
//       .st('opacity',1)
//       .st('text-anchor','middle')
//   })
//   .on("leave", (e)=>{
//     if(e.target.controller().info("scrollDirection") == "REVERSE"){
//
//       truckerDeveloperAutomatabilityValues
//         .transition()
//         .st('opacity',1)
//
//       truckerDeveloperXAxis
//         .transition()
//         .st('opacity',0)
//
//       truckerDeveloperYAxis
//       .transition()
//       .st('opacity',1)
//
//       $jobCircles
//         .transition()
//         .at('cy',d=>yScale(d.automatability))
//         .at('cx', introCircleXLocation);
//
//       truckerDeveloperSkillValues
//         .st('opacity',0)
//     }
//     else{}})
//   .addTo(controllerTwoJobs)
//
//
// // comparison-job-example-skill
// const sceneJob4 = new ScrollMagic.Scene({
//   triggerElement: ".comparison-job-example-skill",
//   offset:  0,
//   duration: 1,
//   triggerHook: 0
// })
// .on("enter", (e)=>{
//
// d3.selectAll('.y-axis-label').st('opacity',0)
// d3.selectAll('.intro-y-axis').st('opacity',0)
// d3.selectAll('.intro-jobs-circles').st('opacity',0)
// d3.selectAll('.intro-job-names').st('opacity',0)
// d3.selectAll('.intro-automatability-values').st('opacity',0)
//
//
// })
// .on("leave", (e)=>{
//   if(e.target.controller().info("scrollDirection") == "REVERSE"){
//     $jobCircles
//       .transition()
//       .at('cy',()=>yScale(0.5))
//       .transition()
//       .at('cx',d=> xScale(d.skillTruckerScore))
//
//     truckerDeveloperSkillValues
//       .transition()
//       .text(d=>d.skillTruckerScore)
//       .st('text-anchor','middle')
//       .at('x',d=> xScale(d.skillTruckerScore))
//       .at('y',()=>yScale(0.5))
//   }
//   else{}})
// .addTo(controllerTwoJobs)
//

export default {init, updateStep}
