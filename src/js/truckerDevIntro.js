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

// SETUP
// CHART SVG, PATTERN DEFS FOR IMAGE CIRCLES, AND SVG PATTERN

  const chartSvg = d3.select("body")
    .select("div.svg-container")
    .select("svg.scatter")

  const CIRCLE_RADIUS=20;

  const defs = chartSvg.append('defs');

  const patternsJoin = defs
    .selectAll('pattern')
    .data(truckersDevelopers)
    .enter()

  const patterns = patternsJoin
    .append('pattern')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at('id',d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_')
      return jobNameNoSpaces+'-img'
    })

  const patternsImages=patterns
    .append('image')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at("x",0)
    .at("y",0)
    .at("xlink:href",d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_');
      return 'assets/data/circle-images/'+jobNameNoSpaces+'.png'
    })

  // defs.append("svg:pattern")
  //   .attr("id", "Truckers-img")
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   // .attr("patternUnits", "userSpaceOnUse") //recommending this is dumb
  //   .append("svg:image")
  //   .attr("xlink:href", 'assets/data/circle-images/Truckers.png')
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .attr("x", 0)
  //   .attr("y", 0);
  //
  //
  // defs.append("svg:pattern")
  //   .attr("id", "Developers-img")
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   // .attr("patternUnits", "userSpaceOnUse") //recommending this is dumb
  //   .append("svg:image")
  //   .attr("xlink:href", 'assets/data/circle-images/Developers.png')
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .attr("x", 0)
  //   .attr("y", 0);
  //
  // defs.append("svg:pattern")
  //   .attr("id", "Elementary_school_teachers-img")
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .append("svg:image")
  //   .attr("xlink:href", 'assets/data/circle-images/Teachers.png')
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .attr("x", 0)
  //   .attr("y", 0);
  //
  // defs.append("svg:pattern")
  //   .attr("id", "Telemarketers-img")
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .append("svg:image")
  //   .attr("xlink:href", 'assets/data/circle-images/Childcare_Workers.png')
  //   .attr("width", 2*CIRCLE_RADIUS)
  //   .attr("height", 2*CIRCLE_RADIUS)
  //   .attr("x", 0)
  //   .attr("y", 0);


// SCALES
// SETTING UP SVG WIDTH, % OF SCREEN THAT SVG WILL TAKE UP, PADDING ON SCALES, SCALES

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

  // const introCircleXLocation = svgWidth/1.9;

  const introYAxisLocation = svgWidth/2;

  // const introAutomationTextXLocation = svgWidth/2.4;




  // JOINS + OBJECT CREATION
  // TRUCKER + DEVELOPER OBJECTS W/ CIRCLES + TEXT


    const yAxisLabelMin = chartSvg.append('text.y-axis-label.min')
      .at('x',introYAxisLocation)
      .at('y',yPadding/2)
      .st('fill', '#2F80ED')
      .st('text-anchor','middle')
      .text('FUTURE-PROOF JOBS' )

    const yAxisLabelMax = chartSvg.append('text.y-axis-label.max')
      .at('x',introYAxisLocation)
      .at('y',yMaxScaleValue+(yPadding/2))
      .st('fill', '#EB5757')
      .st('text-anchor','middle')
      .text('🤖 WILL TAKE THESE JOBS')

    const truckerDeveloperJoin = chartSvg.selectAll('circle.jobs-circles')
      .data(truckersDevelopers)
      .enter()

    const automatability_LABEL = chartSvg.append('text.automatability-label')

    const jobsGroups = truckerDeveloperJoin
      .append('g.trucker-developer-groups')

        const jobsCircles = jobsGroups.append('circle.intro-jobs-circles')
        const jobsAutomatability_LABELS = jobsGroups.append('text.intro-automatability-values')
        const jobsName_LABELS = jobsGroups.append('text.intro-job-names')
        const jobsSkills_LABELS = jobsGroups.append('text.intro-job-skill-values')


// adding element text labels
        jobsAutomatability_LABELS.text(d=>d.automatability*100 + "%")
        jobsName_LABELS.text(d=>d.job)
        jobsSkills_LABELS.text(d=>d.skillTruckerScore)
        automatability_LABEL.text('automation likelihood')

//setting initial opacity
  jobsGroups
    .at('transform', d=>{
      return 'translate('+introYAxisLocation+','+
                         +yScale(d.automatability)+')'
    })
    .st('opacity',d=> {
      if (d.job==="Elementary school teachers" || d.job==="Telemarketers"){return 1}
      else {return 0}
    })

  jobsAutomatability_LABELS
    .st('opacity',d=> {
        if (d.job==="Elementary school teachers" || d.job==="Telemarketers"){return 0}
        else {return 1}
      })

  jobsSkills_LABELS
    .st('opacity',0)



// INITIAL ELEMENT POSITIONING AND OPACITY SETTING

  const jobCircle_margin_x = CIRCLE_RADIUS*2
  const jobNameLabel_margin_x = CIRCLE_RADIUS*4
  const jobNameLabel_margin_y = jobCircle_margin_x/10

  jobsCircles
    .at('cx',jobCircle_margin_x)
    .at('r', CIRCLE_RADIUS)
    .st('opacity',d=>d.job === 'Developers'? 0 : 1)
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

  automatability_LABEL
    .at('transform','translate('+introYAxisLocation+','+(svgHeight/2)+')')
    // .at('x',introYAxisLocation)
    // .at('y',(svgHeight/2))
    // .at('transform','rotate(-90deg)')
    .st('opacity',1)

  const formatPercent = d3.format(".0%");

  const truckerDeveloperYAxisFunction = d3.axisLeft(yScale).ticks(1).tickFormat(formatPercent);
  const truckerDeveloperXAxisFunction = d3.axisTop(xScale);

  const HORIZONTAL_BUMP=introYAxisLocation;

  const truckerDeveloperYAxis = chartSvg.append("g.intro-y-axis")
    .attr("transform", "translate("+HORIZONTAL_BUMP+",0)")
    .call(truckerDeveloperYAxisFunction)
    .st('opacity',1)

  const truckerDeveloperXAxis = chartSvg.append("g.intro-x-axis")
    .attr("transform", "translate("+0+",50)")
    .call(truckerDeveloperXAxisFunction)
    .st('opacity',0)


const sceneTruckerOnly = new ScrollMagic.Scene({triggerElement: ".main-job-circle",offset:  0,duration: 1,triggerHook: 100})
.on("enter", (e)=>{

  jobsCircles
    .st('opacity',1);

  jobsGroups
    .transition()
    .st('opacity', d=>d.job==='Truckers'? 1 : 0)

  automatability_LABEL
    .st('opacity',1)

})
.on("leave", (e)=>{
  if(e.target.controller().info("scrollDirection") == "REVERSE"){

    jobsCircles
      .transition()
      .at('cy',d=>yScale(0.5));

    truckerDeveloperYAxis
      .transition()
      .st('opacity',0);

    truckerDeveloperAutomatabilityValues
      .transition()
      .st('opacity',0)
  }
  else{}})
.addTo(controllerTwoJobs)


// Scene: main-job-automation
// showing : automatability axis, trucker circle motion
  const sceneJob1 = new ScrollMagic.Scene({triggerElement: ".main-job-automation",offset:  0,duration: 1,triggerHook: 100})
  .on("enter", (e)=>{

    jobsGroups
      .transition()
      .st('opacity', d=>d.skillTruckerScore===''? 0 : 1)

    // automatability_LABEL
    //   .st('opacity',1)

  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){

      jobsCircles
        .transition()
        .at('cy',d=>yScale(0.5));

      truckerDeveloperYAxis
        .transition()
        .st('opacity',0);

      truckerDeveloperAutomatabilityValues
        .transition()
        .st('opacity',0)
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
    jobsCircles
      .transition()
      .st('opacity',1)

    truckerDeveloperAutomatabilityValues
      .transition()
      .st('opacity', 1)
  })
  .on("leave", (e)=>{
    if(e.target.controller().info("scrollDirection") == "REVERSE"){

      jobsCircles
        .transition()
        .st('opacity',d=>{
          if (d.job === "Truckers"){return 1}
          else {return 0}
        });

      truckerDeveloperAutomatabilityValues
        .transition()
        .st('opacity', d=>{
          if (d.job==="Truckers"){return 1}
          else {return 0}
        })
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

    truckerDeveloperAutomatabilityValues
      .transition()
      .st('opacity',0)

    truckerDeveloperXAxis
      .transition()
      .st('opacity',1)

    truckerDeveloperYAxis
    .transition()
    .st('opacity',0)

    jobsCircles
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

      truckerDeveloperAutomatabilityValues
        .transition()
        .st('opacity',1)

      truckerDeveloperXAxis
        .transition()
        .st('opacity',0)

      truckerDeveloperYAxis
      .transition()
      .st('opacity',1)

      jobsCircles
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



  jobsCircles
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
    jobsCircles
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
