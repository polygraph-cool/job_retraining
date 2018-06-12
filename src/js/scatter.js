
// Setting up data and data objects
const MAX_AUTO = 1;
const MIN_AUTO = 0;

let VERTICAL_LABEL_POSITION_SHORTER = null;
let VERTICAL_LABEL_POSITION_TALLER = null;
let LINE_HEIGHT_LEAST_SIMILAR_JOB = null;
let LINE_HEIGHT_MOST_SIMILAR_JOB = null;
let INTRO_Y_AXIS_LOCATION = null;

let svgWidth = null;
let xMaxScaleValue = null;
let xPadding = null;

let yScale = null;
let yMaxScaleValue = null;
let yPadding = null;

let yAxisGroup = null;

let $automatability_LABEL = null;
let $jobCircles = null;
let $automatabilityBisectingGroup = null;

let scalesObject = {}

let $legendWages = null;
let $legendjobNumber = null;

// let allData = null;
let similarity = null;
let selectedJobData = null;
let selectedJobID=415;

let jobTooltip = null;
let jobSkillsContainer = null;

let $jobDropdownMenu = null;


const defaultSceneSetting = {'cx':'',
														 'cy':'',
													 	 'r':'',
													 	 'fill':'',
													 	 'yScale':'',
													 	 'opacityCircles':'',
														 'opacityAnnotations':''
													 	 }



// Key objects for displaying values based on job id
const keyObjectJobName = {}
const keyObjectJobNumber = {}
const keyObjectJobAuto = {}
const keyObjectJobWage = {}
const keyObjectSkillName = {}


let crosswalk = null;
let crosswalkSkills = null;
let selectedJobSkills = [0,0,0,0,0]
let skills = []

// creating array of files to load
const pathData = 'assets/data/'
const fileNames = ['crosswalk_jobs','similarity','crosswalk_skills','skills']
let files = []
fileNames.forEach((category)=>{
	files.push(pathData+category+'.csv')
})

const $chartContainer = d3.select('figure.svg-container')
const $chartSvg = $chartContainer.select('svg.scatter')


let xScale = null;


const wageRatioArray = [0.2,0.5, 0.75, 0.9,1.1, 1.25, 2, 5]
const wageColors = ['#a50026','#d73027','#f46d43','#fee090','#e0f3f8','#74add1','#4575b4','#313695']



function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectJobData(data, selectedJobID){
	const selectedJobDataAllJobs = data.filter(item=> +item.id_selected === +selectedJobID)
  const selectedJobData = selectedJobDataAllJobs.filter(item=> +item.id_compared != +item.id_selected)
	return selectedJobData
}

function setupXScale(selectedJobData){
  const $chartSvg = d3.select("svg.scatter")
  const svgWidth = $chartSvg.at('width')
  const widthPercentage = 0.9;
  const xMaxScaleValue = svgWidth * widthPercentage;
  const xPadding = (1-widthPercentage)*svgWidth;

	const xScale = d3.scaleLinear()
		.domain(d3.extent(selectedJobData, d=> d.similarity))
		.range([0+xPadding, xMaxScaleValue]);
	return xScale;
}

function compare(a,b) {
  if (a.imp < b.imp)
    return 1;
  if (a.imp > b.imp)
    return -1;
  return 0;
}


function findLeastSimilarJob(selectedJobData){
  const leastSimilarJobValue = d3.min(selectedJobData, d=> d.similarity);
  const leastSimilarJob = selectedJobData.filter(job=>job.similarity===leastSimilarJobValue)
  return leastSimilarJob;
}

function findMostSimilarJob(selectedJobData){
  const mostSimilarJobValue = d3.max(selectedJobData, d=> d.similarity);
  const mostSimilarJob = selectedJobData.filter(job=>job.similarity===mostSimilarJobValue)
  return mostSimilarJob;
}


function formatCrosswalk(crosswalk){
  crosswalk.forEach((item)=>{
    item.id    = +item.id;
    item.auto  = +item.auto;
    item.wage  = +item.wage;
    item.number= +item.number;
  })
}

function formatSimilarityValues(similarity){
  similarity.forEach((item)=>{
    item.similarity = +item.similarity;
    item.id_compared= +item.id_compared;
    item.id_selected= +item.id_selected;
  })
}

function formatCrosswalkSkills(crosswalkSkills){
  crosswalkSkills.forEach(item=>{
    item.skill_id= +item.skill_id
  })
}

function formatTopSkillsByJob(skills){
  skills.forEach(item=>{
    item.id_selected= +item.id_selected;
    item.imp        = +item.imp;
    item.skill_id   = +item.skill_id;
    item.rank       = +item.rank;
  })
}


function keySetupJobName(crosswalk, keyObject){
  crosswalk.forEach(job=>{
    keyObject[job.id]=job.job_name;
  })
}

function keySetupJobNumber(crosswalk, keyObject){
  crosswalk.forEach(job=>{
    keyObject[job.id]=job.number;
  })
}

function keySetupJobAutomation(crosswalk, keyObject){
  crosswalk.forEach(job=>{
    keyObject[job.id]=job.auto;
  })
}

function keySetupJobWage(crosswalk, keyObject){
  crosswalk.forEach(job=>{
    keyObject[job.id]=job.wage;
  })
}

function keySetupJobSkills(crosswalkSkills, keyObject){
  crosswalkSkills.forEach(skill=>
		keyObject[skill.skill_id]=skill.skill
	)
}


function setupScales(){


  scalesObject.radiusScale= d3.scaleSqrt()
    .domain([0,d3.max(crosswalk, (d)=>{return d.wage})])
    .range([2,8])

	scalesObject.colorScale = d3.scaleLinear()
		.domain(wageRatioArray)
		.range(wageColors)

   return scalesObject;

}

function setupLegends(radiusScale, colorScale){


  // Label arrays for wage and job number
  const wageRatioIncreaseArray = [{'value':1.1, 'label':'+10%'},
    {'value':1.25, 'label':'25%'},
    {'value':2, 'label':'100%'},
    {'value':5, 'label':'400%'}]

  const jobNumberLabelArray = [
    {'size':10000, 'label':'10K'},
    {'size':100000, 'label':'500K'},
    {'size':1000000, 'label':'1M'}
  ]

// LEGENDS
// Creating and positioning the wage legend
  $legendWages = $chartSvg.append('g.legend__wages')

  $legendWages.at('transform', 'translate('+ svgWidth*0.75 +','+yPadding/6+')')

  const $legendWages_title= $legendWages.append('text.legend-wages__title')

  const $legendWages_category_groups = $legendWages
    .selectAll('g.legend-wages__category')
    .data(wageRatioIncreaseArray)
    .enter()
    .append('g.legend-wages__category')

  const LEGEND_WAGE_RECTANGLE_WIDTH = svgWidth/30;
  const LEGEND_WAGE_RECTANGLE_HEIGHT = yPadding/10;

  // Moving each category group
  $legendWages_category_groups
    .at('transform', (d,i)=>{
      const xTranslate = (i* LEGEND_WAGE_RECTANGLE_WIDTH) + (i*LEGEND_WAGE_RECTANGLE_WIDTH/2);
      const yTranslate = radiusScale(1000000)
      return 'translate('+xTranslate+','+yTranslate+')'
    })

  const $legendWages_rectangles = $legendWages_category_groups
        .append('rect.legend-wages__rectangle')

  $legendWages_rectangles
    .at('width', LEGEND_WAGE_RECTANGLE_WIDTH)
    .at('height', yPadding/10)
    .st('fill', d=> colorScale(d.value))
    .st('stroke', '#C6C6C6')

  const $legendWages_text_annotations= $legendWages_category_groups
    .append('text.legend-wages__text-annotation')

  $legendWages_text_annotations
    .text(d=>d.label)
    .at('y', LEGEND_WAGE_RECTANGLE_HEIGHT*3)

  const WAGE_LABEL_LOCATION = wageRatioIncreaseArray.length/2 *LEGEND_WAGE_RECTANGLE_WIDTH + LEGEND_WAGE_RECTANGLE_WIDTH;

  $legendWages_title
    .text('SALARY INCREASE')
    .at('x', WAGE_LABEL_LOCATION)



// LEGENDS
// rendering job number legend
  $legendjobNumber = $chartSvg.append('g.legend-job-number')

  $legendjobNumber
    .at('transform', 'translate('+ xPadding +','+yPadding/6+')')

  const $legendjobNumber_category_groups = $legendjobNumber
    .selectAll('g.legend-job-number__category')
    .data(jobNumberLabelArray)
    .enter()
    .append('g.legend-job-number__category')

  const RADIUS_MULTIPLIER = 4

  $legendjobNumber_category_groups
    .at('transform', (d,i)=>{
      const xTranslate = RADIUS_MULTIPLIER*i*radiusScale(1000000)
      const yTranslate = radiusScale(1000000);
        return 'translate('+xTranslate+','+yTranslate+')'
    })

  const $legendjobNumber_circles = $legendjobNumber_category_groups
    .append('circle.legend-job-number__circle')

  $legendjobNumber_circles
    .at('r', d=> radiusScale(d.size))
    .st('fill', '#FFF')
    .st('stroke', '#C6C6C6')

  const $legendjobNumber_text_annotations = $legendjobNumber_category_groups
    .append('text.legend-job-number__text')

  $legendjobNumber_text_annotations
    .text(d=>d.label)
    .at('y', (RADIUS_MULTIPLIER/2) *radiusScale(1000000))


  const JOB_NUMBER_LABEL_LOCATION = RADIUS_MULTIPLIER * Math.round((jobNumberLabelArray.length-1) /2 )  *radiusScale(1000000)

  const $legendjobNumber_title_background= $legendjobNumber.append('text.job-number-title-background')
  const $legendjobNumber_title= $legendjobNumber.append('text.job-number-title')

  $legendjobNumber_title_background
    .text('JOBS IN 2026')
    .at('x', JOB_NUMBER_LABEL_LOCATION)
    .st('stroke', '#FFF')
    .st('stroke-width', '1px')

  $legendjobNumber_title
    .text('JOBS IN 2026')
    .at('x', JOB_NUMBER_LABEL_LOCATION)

  $legendjobNumber
		.st('opacity',0)
    // .st('visibility','hidden')

  $legendWages
    .st('visibility','hidden')
}


function resize(){

  const fullSVGHeight = $chartSvg.at('height')
  const REDUCED_VIEWPORT_HEIGHT_PERCENTAGE = 0.875
  const REMAINING_VIEWPORT_HEIGHT_PERCENTAGE = 1-REDUCED_VIEWPORT_HEIGHT_PERCENTAGE

  // $miscChartSections
  //   .st('height', (1-REDUCED_VIEWPORT_HEIGHT_PERCENTAGE) * fullSVGHeight + 'px')

  $chartSvg.at('height', (REDUCED_VIEWPORT_HEIGHT_PERCENTAGE*fullSVGHeight))

  // Setting up max width and height parameters for x and y scales
  svgWidth = $chartSvg.at('width')
  const maxWidthPercentage = 0.9;
  xMaxScaleValue = svgWidth * maxWidthPercentage;

  xPadding = (1-maxWidthPercentage)*svgWidth;


  const svgHeight = $chartSvg.at('height')
  const maxHeightPercentage = 0.9;
  yMaxScaleValue = svgHeight * maxHeightPercentage;

  const Y_PADDING_MULTIPLIER = 1.25
  yPadding = REMAINING_VIEWPORT_HEIGHT_PERCENTAGE * Y_PADDING_MULTIPLIER * svgHeight;

  INTRO_Y_AXIS_LOCATION = svgHeight/2;

  yScale = d3.scaleLinear()
    .domain([MIN_AUTO,MAX_AUTO])
    .range([0+yPadding, yMaxScaleValue]);

  xScale = setupXScale(selectedJobData)


  VERTICAL_LABEL_POSITION_SHORTER =INTRO_Y_AXIS_LOCATION*0.8;

  VERTICAL_LABEL_POSITION_TALLER =INTRO_Y_AXIS_LOCATION*0.6;

  LINE_HEIGHT_LEAST_SIMILAR_JOB = INTRO_Y_AXIS_LOCATION - VERTICAL_LABEL_POSITION_SHORTER
  LINE_HEIGHT_MOST_SIMILAR_JOB = INTRO_Y_AXIS_LOCATION - VERTICAL_LABEL_POSITION_TALLER


}

function dropDownChange(d,i,n, colorScale){
    // selecting relevant job ID and its associated job data
		const selectedJobID=d3.select(n[i]).property('value')
		const updatedData = selectJobData(similarity, selectedJobID);
    const currentJobId=updatedData[0].id_selected;

		console.log('selected job id: '+ selectedJobID);
		console.log('updated data ' +updatedData);
		console.log('current job '+currentJobId);

    // Updating xScale with new data
		const xScale = setupXScale(updatedData);


		const $miscChartSections = d3.select('.misc-chart-elements-container')
		const $miscChartSectionTitle = $miscChartSections.select("div.chart-title-div")
    // Updating main label text
    $miscChartSectionTitle.select('.chart-title-pt2').text(numberWithCommas(keyObjectJobNumber[currentJobId]))
    $miscChartSectionTitle.select('.chart-title-pt3').text(keyObjectJobName[currentJobId])
    $miscChartSectionTitle.select('.chart-title-pt5').text('$'+numberWithCommas(keyObjectJobWage[currentJobId]))

    // Updating yScale domain to exclude all items with a worse automation outcome
    yScale.domain([0,keyObjectJobAuto[currentJobId]])

    // Removing all previously created circles
    const $chartSvg = d3.select('svg.scatter')

		$chartSvg.selectAll('circle.job').remove()

		let $jobCircles = $chartSvg
			.selectAll('circle.job')
			.data(updatedData)
			.enter()
			.append('circle.job')


		$jobCircles
			.at('cx', d=>{return xScale(d.similarity)})
      .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
      .st('fill', d=>{
        const jobSelectedWage = keyObjectJobWage[d.id_selected]
        const jobComparedWage = keyObjectJobWage[d.id_compared]
        const wageChange = jobComparedWage/jobSelectedWage;
        return scalesObject.colorScale(wageChange)
      })
      .st('opacity',d=>{
        if (+keyObjectJobAuto[d.id_compared]>keyObjectJobAuto[d.id_selected]){return 0}
        else {return 1}
      })
			.st('stroke', 'black')
      .at('r', d=>{
				const wage=keyObjectJobNumber[d.id_compared];
				return scalesObject.radiusScale(wage)
			})

			$jobCircles
        .on('mouseenter', showTooltip)
			  .on('mouseleave', hideTooltip)
}

function hideTooltip(){
  jobTooltip.st('visibility','hidden')
}

function showTooltip(d,i,n){


  selectedJobSkills = selectJobData(skills, d.id_compared);
  selectedJobSkills = selectedJobSkills.sort(compare);

  jobTooltip = $chartContainer.select("div.jobTooltip")

  jobTooltip.st('visibility','visible')

  const xCoord = d3.select(n[i])
    .at("cx")

  const yCoord = d3.select(n[i])
    .at("cy")

  jobTooltip.st("left", (xCoord+"px") )
    .st("top", (yCoord+"px") )

  const jobComparedName = d3.select("div.job-compared-name");
  jobComparedName.text(keyObjectJobName[d.id_compared])

  const jobComparedNumber = d3.select("div.job-compared-number");
  jobComparedNumber.text(numberWithCommas(keyObjectJobNumber[d.id_compared])+' jobs in 2026')

  const jobSkillsContainer = jobTooltip.select('div.job-skills-container')

  const jobSkillsBarRow = jobSkillsContainer.selectAll('div.bar-container')

  const jobSkillsNames = jobSkillsContainer.selectAll("div.job-bar-name")
    .data(selectedJobSkills)

  const jobSkillsBars  = jobSkillsContainer.selectAll("div.job-bar")
    .data(selectedJobSkills)

  const jobSkillsValues= jobSkillsContainer.selectAll("div.job-bar-value")
    .data(selectedJobSkills)

  const xScaleSkillMultiplier= 1;

  jobSkillsBars.st('height','4px')
    .st('width', skill=> {
      return xScaleSkillMultiplier * skill.imp+'px'
    })
    .st('background','#D928BC')

  jobSkillsNames.text((skill,i)=>{
    return (i+1)+'. '+keyObjectSkillName[skill.skill_id]
  })

  jobSkillsValues.text(skill=>{
    return skill.imp+'%';
  })


}

function createDropdown(){

// Creating job dropdown menu
	$jobDropdownMenu=d3.select('div.job-selector__container')
		.append('select')
    .at('class', 'job-selector__dropdown')
		.st('opacity',0)
    // .st('visibility','hidden')

	const $jobButtons = $jobDropdownMenu.selectAll('option.job-selector__job-button')
		.data(crosswalk)
		.enter()
		.append('option.job-selector__job-button')
		.at('value', d=>d.id)

	$jobButtons.text((d)=>{
			return d.job_name;
		})

  $jobDropdownMenu
		.on('change', dropDownChange)
}



function createCircles(){
	$jobCircles = $chartSvg
		.selectAll('circle.job')
		.data(selectedJobData)
		.enter()
		.append('circle.job')

    $jobCircles
      .at('cx', d=>{return xScale(d.similarity)})
      .at('cy', INTRO_Y_AXIS_LOCATION)
      .st('fill', 'white')
      .st('stroke', 'black')
      .at('r','3')

  console.log('function createCircles()');
}

function setupTooltip(){

	const jobSkillsBarRow = jobSkillsContainer.selectAll('div.job-bar-container')
		.data(selectedJobSkills)
		.enter()
		.append('div.bar-container')

	const jobSkillsNames = jobSkillsBarRow.append("div.job-bar-name").data(selectedJobSkills).enter()

  const jobDataContainer = jobSkillsBarRow.append('div.job-data-container')
  const jobSkillsBarsContainers  = jobDataContainer.append("div.job-bar-box")

	const jobSkillsBars  = jobSkillsBarsContainers.append("div.job-bar").data(selectedJobSkills).enter()
	const jobSkillsValues= jobDataContainer.append("div.job-bar-value").data(selectedJobSkills).enter()

}

function setupDOMElements(leastSimilarJob,mostSimilarJob){

  // Creating annotations elements for similarity-only views
  const leastSimilarJob_ANNOTATION = $chartSvg.append('g.least-similar-annotation similarity-annotation')
  const mostSimilarJob_ANNOTATION = $chartSvg.append('g.most-similar-annotation similarity-annotation')

  const leastSimilarJob_LINE = leastSimilarJob_ANNOTATION.append('line')
  const mostSimilarJob_LINE = mostSimilarJob_ANNOTATION.append('line')

  const leastSimilarJob_TEXT = leastSimilarJob_ANNOTATION.append('text')
  const mostSimilarJob_TEXT = mostSimilarJob_ANNOTATION.append('text')

  leastSimilarJob_TEXT.text(keyObjectJobName[(leastSimilarJob[0].id_compared)])
  mostSimilarJob_TEXT.text(keyObjectJobName[(mostSimilarJob[0].id_compared)]).st('text-anchor', 'end')

  // Positioning annotation elements
  leastSimilarJob_ANNOTATION
    .at('transform', d=>{
      const xTranslate = xScale(leastSimilarJob[0]['similarity']);
      return 'translate('+xTranslate+','+VERTICAL_LABEL_POSITION_SHORTER +')'
    })

  mostSimilarJob_ANNOTATION
    .at('transform', d=>{
      const xTranslate = xScale(mostSimilarJob[0]['similarity']);
      return 'translate('+xTranslate+','+VERTICAL_LABEL_POSITION_TALLER +')'
    })

  leastSimilarJob_LINE
    .at('x1',0)
    .at('y1',0)
    .at('x2',0)
    .at('y2',LINE_HEIGHT_LEAST_SIMILAR_JOB)
    .st('stroke-width',1)
    .st('stroke','black')

  mostSimilarJob_LINE
    .at('x1',0)
    .at('y1',0)
    .at('x2',0)
    .at('y2',LINE_HEIGHT_MOST_SIMILAR_JOB)
    .st('stroke-width',1)
    .st('stroke','black')

  // Adding an x axis label to the chart

  const $xAxisLabel = $chartSvg.append('text.axis-label similarity')
  const X_AXIS_LABEL_HEIGHT = INTRO_Y_AXIS_LOCATION * 1.1
  // const svgWidth = $chartSvg.at('width')


  $xAxisLabel
    .at('x', svgWidth/2 )
    .at('y',X_AXIS_LABEL_HEIGHT)
    .text('SKILL SIMILARITY TO TRUCKERS')
    .st('text-anchor','middle')

  // Adding max and min similarity/ y-axis labels
  const maxSimilarityLabel = $chartSvg.append('text.axis-label max-similarity')
  const minSimilarityLabel = $chartSvg.append('text.axis-label min-similarity')

  const xAxisMaxMinLabelHeight = INTRO_Y_AXIS_LOCATION * 1.05

  maxSimilarityLabel
    .at('x', xMaxScaleValue )
    .at('y',xAxisMaxMinLabelHeight)
    .text('SIMILAR')
    .st('text-anchor','middle')

  minSimilarityLabel
    .at('x', xPadding )
    .at('y',xAxisMaxMinLabelHeight)
    .text('DIFFERENT')
    .st('text-anchor','middle')

  // Adding automatability/x-axis, and max and min automatability labels
  const formatPercent = d3.format(".0%");

  const yAxisLabel = d3.axisLeft(yScale).ticks(1).tickFormat(formatPercent);

  yAxisGroup = $chartSvg.append("g.scatter-y-axis")
    .attr("transform", "translate("+xPadding+",0)")
    .call(yAxisLabel)
    .st('opacity',0)

  $automatability_LABEL = $chartSvg.append('text.scatter-label-y-axis')

  $automatability_LABEL
    .at('transform',`translate(${xPadding},${INTRO_Y_AXIS_LOCATION}) rotate(270)`)
    .st('opacity',0)
    .text('AUTOMATABILITY LIKELIHOOD')


  jobTooltip = d3.select("figure.svg-container").append("div.jobTooltip")
  const jobSelectedName = d3.select("div.job-selected-name")

  const jobComparedNumber = jobTooltip.append("div.job-compared-number")
  const jobComparedName = jobTooltip.append("div.job-compared-name")

  jobSkillsContainer =jobTooltip.append("div.job-skills-container")
  const jobSkillsSectionNames =jobSkillsContainer.append('div.tooltip-section-names')
  const jobSkillsSectionNamesSkill = jobSkillsSectionNames.append('div.section-name-skills').text('SKILL')
  const jobSkillsSectionNamesImportance = jobSkillsSectionNames.append('div.section-name-importance').text('IMPORTANCE')


  // Automatability group labels

  $automatabilityBisectingGroup = $chartSvg.append('g.bisecting-automation-group')
  $automatabilityBisectingGroup
      .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')

  let $automatabilityBisectingLine = $automatabilityBisectingGroup.append('line.bisecting-line')
  $automatabilityBisectingLine.at('x1',xPadding)
    .at('y1',0)
    .at('x2',xMaxScaleValue)
    .at('y2',0)

  let $automatabilityBisectingLabel =$automatabilityBisectingGroup.append('text.bisecting-line-label')
  $automatabilityBisectingLabel.text('TRUCKERS')

  $automatabilityBisectingGroup
    // .st('visibility','hidden')
		.st('opacity',0)


}

function updateStep(step){
  if(step==='x-axis-base'){

		defaultSceneSetting.cy = function(){return INTRO_Y_AXIS_LOCATION}
		// defaultSceneSetting.cy = function(d){return yScale(keyObjectJobAuto[d.id_compared])}
		defaultSceneSetting.r = function(){return 3}
		defaultSceneSetting.fill = function(){return '#FFF'}
		defaultSceneSetting.yScale = function(){yScale.domain([0,1])}
		defaultSceneSetting.opacityCircles = function(){return 1}
		defaultSceneSetting.opacityAnnotations = function(){return 0}

		defaultSceneSetting.yScale()

		$jobCircles
			.transition()
			.at('cy', defaultSceneSetting.cy)
			.at('r', defaultSceneSetting.r)
			.st('fill', defaultSceneSetting.fill)
			.st('opacity',defaultSceneSetting.opacityCircles)

		$chartSvg.selectAll('g.similarity-annotation')
			.transition()
			.st('opacity',defaultSceneSetting.opacityCircles)

		yAxisGroup
			.st('opacity',defaultSceneSetting.opacityAnnotations)

		$automatability_LABEL
			.transition()
			.st('opacity',defaultSceneSetting.opacityAnnotations)

		$automatabilityBisectingGroup
			.transition()
			.st('opacity',defaultSceneSetting.opacityAnnotations)

  }
  else if(step==='xy-axis-scatter'){

		yScale.domain([0,1])

    $chartSvg.selectAll('g.similarity-annotation')
      .st('opacity',0)

    const Y_AXIS_ANNOTATION_HEIGHT =yMaxScaleValue*1.05

    yAxisGroup
			.transition()
			.st('opacity',1)

    $automatability_LABEL
			.transition()
			.st('opacity',1)

    $chartSvg.selectAll('text.axis-label')
      .at('y',Y_AXIS_ANNOTATION_HEIGHT)

    $jobCircles
      .transition()
      .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
			.st('opacity',1)


    $automatabilityBisectingGroup
      // .st('visibility', 'visible')
			.transition()
			.st('opacity', defaultSceneSetting.opacityCircles)
      .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
  }
  else if(step==='xy-axes-scatter'){

    yScale.domain([0,0.79])

    $jobCircles
      .transition()
      .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
      .st('opacity',d=>{
        if (+keyObjectJobAuto[d.id_compared]>+keyObjectJobAuto[d.id_selected]){return 0}
        else {return 1}
      })


    $automatabilityBisectingGroup
        .transition()
        .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
        .st('opacity',0)

    $jobCircles
    .st('opacity',d=> +keyObjectJobAuto[d.id_compared]>+keyObjectJobAuto[d.id_selected]? 0 : 1)
    .transition()
    .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
		.st('fill','#FFF')
		.at('r', 3)

		$legendWages
			.st('visibility','hidden')
  }
  else if(step==='xy-axes-scatter-filtered'){


    $legendjobNumber
			.transition()
			.st('opacity',0)
      // .st('visibility','hidden')

		$legendWages
			.transition()
      .st('visibility','visible')



    $jobCircles
      .transition()
			.at('r', 3)
      .st('fill', d=>{
        const jobSelectedWage = keyObjectJobWage[d.id_selected]
        const jobComparedWage = keyObjectJobWage[d.id_compared]
        const wageChange = jobComparedWage/jobSelectedWage;
        return scalesObject.colorScale(wageChange)
      })
      .transition()
      .delay(1000)
      .st('opacity', d=>{
        if (
            (keyObjectJobWage[d.id_selected]<keyObjectJobWage[d.id_compared])
            &&
            (keyObjectJobAuto[d.id_selected]>keyObjectJobAuto[d.id_compared])
        ){return 1}
        else {return 0}
      })

  }
  else if(step==='show-similarity-auto-wage'){
    // $jobDropdownMenu
    //   .st('visibility','visible')

			$jobDropdownMenu
				.transition()
				.st('opacity',0)

      $legendjobNumber
				.transition()
				.st('opacity', 1)
        // .st('visibility','visible')

      $jobCircles
        .transition()
  			.at('r', d=>{
  				const wage=keyObjectJobNumber[d.id_compared];
  				return scalesObject.radiusScale(wage)
  			})
  }
		else if(step==='show-similarity-auto-wage-number'){
			$jobDropdownMenu
				.transition()
				.st('opacity',1)
				// .st('visibility','visible')
		}
}

function init(){
  return new Promise((resolve, reject) =>{
    d3.loadData(...files, (err, response)=>{
      if(err) reject()
      else{
      crosswalk = response[0];
      similarity  = response[1];
      crosswalkSkills= response[2];
      skills = response[3]

      selectedJobData =	selectJobData(similarity, selectedJobID);
      const leastSimilarJob = findLeastSimilarJob(selectedJobData)
      const mostSimilarJob = findMostSimilarJob(selectedJobData)

      // Making sure crosswalk and top skill data is in the right format
      formatCrosswalk(crosswalk)
      formatSimilarityValues(similarity)
      formatCrosswalkSkills(crosswalkSkills)
      formatTopSkillsByJob(skills)


      // Filling out key object data
      keySetupJobName(crosswalk, keyObjectJobName)
      keySetupJobNumber(crosswalk, keyObjectJobNumber)
      keySetupJobAutomation(crosswalk, keyObjectJobAuto)
      keySetupJobWage(crosswalk, keyObjectJobWage)
      keySetupJobSkills(crosswalkSkills, keyObjectSkillName)

      resize()
      scalesObject = setupScales()
      setupDOMElements(leastSimilarJob,mostSimilarJob)
      setupLegends(scalesObject.radiusScale, scalesObject.colorScale)
      createDropdown()
      setupTooltip()
      createCircles()

      resolve(skills)
      }
    })
  })

}


export default {init, updateStep}



    // selecting job data for trucker job comparisons

    // let selectedJobID = 415; //trucker ID


    // Container setup


    // setup of  container for chart title and job selector


    // Changing svg height to account for the 12.75% vH that chart title and job selector take up



    // Setting up radius scale





		// Setting up key objects to yield each job's name, number, automation, wages, and skills, by id


// Removing skill rectangles from visibility -
    // d3.selectAll('g.all-skills')
    //   .st('opacity',0)
    //
    // d3.selectAll('g.skill-section')
    //   .st('opacity',0)







    // Creating titles
    // const chartTitle = $chartSvg.append('text.chart-title')
    //
    // chartTitle
    //   .at('x',svgWidth/2)
    //   .at('y',yPadding/2)
    //   .st('text-anchor','middle')
    //   .text('Which careers should truckers transition to?')

    // Note: adding titles in via div


    // Setting text to read correct annotations data




// UPDATE JOB CIRCLES FUNCTION
		// $jobCircles.on('mouseenter',(d,i,n)=>{
    //
			// selectedJobSkills = selectJobData(skills, d.id_compared);
			// selectedJobSkills = selectedJobSkills.sort(compare);
      //
			// const jobTooltip = d3.select("div.jobTooltip")
      //
			// jobTooltip.st('visibility','visible')
      //
			// const xCoord = d3.select(n[i])
			// 	.at("cx")
      //
			// const yCoord = d3.select(n[i])
			// 	.at("cy")
      //
			// jobTooltip.st("left", (xCoord+"px") )
			// 	.st("top", (yCoord+"px") )
      //
			// // const jobSelectedName = d3.select("div.job-selected-name");
			// // jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])
      // //
			// const jobComparedName = d3.select("div.job-compared-name");
			// jobComparedName.text(keyObjectJobName[d.id_compared])
      //
			// // const jobSelectedNumber = d3.select("div.job-selected-number");
			// // jobSelectedNumber.text("Main job quantity: "+numberWithCommas(keyObjectJobNumber[d.id_selected]))
      // //
			// const jobComparedNumber = d3.select("div.job-compared-number");
			// jobComparedNumber.text(numberWithCommas(keyObjectJobNumber[d.id_compared])+' jobs in 2026')
      //
      //
			// const jobSkillsContainer = jobTooltip.select('div.job-skills-container')
      //
			// const jobSkillsBarRow = jobSkillsContainer.selectAll('div.bar-container')
      //
			// const jobSkillsNames = jobSkillsContainer.selectAll("div.job-bar-name")
			// 	.data(selectedJobSkills)
      //
			// const jobSkillsBars  = jobSkillsContainer.selectAll("div.job-bar")
			// 	.data(selectedJobSkills)
      //
			// const jobSkillsValues= jobSkillsContainer.selectAll("div.job-bar-value")
			// 	.data(selectedJobSkills)
      //
			// const xScaleSkillMultiplier= 1;
      //
			// jobSkillsBars.st('height','4px')
			// 	.st('width', skill=> {
			// 		return xScaleSkillMultiplier * skill.imp+'px'
			// 	})
			// 	.st('background','#D928BC')
      //
			// jobSkillsNames.text((skill,i)=>{
			// 	return (i+1)+'. '+keyObjectSkillName[skill.skill_id]
			// })
      //
			// jobSkillsValues.text(skill=>{
			// 	return skill.imp+'%';
			// })
		// })
		// .on('mouseleave', ()=>{
		// 	jobTooltip.st('visibility','hidden')
		// })









    // BUTTONS
    // const $single_XAxis_Similarity_All_Jobs =d3.select('div.transition-button.only-similarity-axis')
    // const $show_XY_Axes_Similarity_All_Jobs =d3.select('div.transition-button.automation-similarity-axis')
    // const $show_Earnings_Comparison =d3.select('div.transition-button.earnings')
    // const $show_Number_Jobs_Available =d3.select('div.transition-button.jobs-available')

    // Adding in Y axis to scatterplot
    // $show_XY_Axes_Similarity_All_Jobs.on('click',()=>{
    //   jobCircles
    //     .transition()
    //   	.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
    // })





    // const sceneJob1 = new ScrollMagic.Scene({
    //   triggerElement: ".xy-axes-scatter",
    //   offset:  0,
    //   duration: 1,
    //   triggerHook: 0
    // })
    // .on("enter", (e)=>{
    //
    //
    //
    //   let automatabilityBisectingGroup;
    //   let automatabilityBisectingLine;
    //   let automatabilityBisectingLabel;
    //
    //   let automatabilityBisectingGroupCheck = $(".bisecting-automation-group");
    //
    //   if(automatabilityBisectingGroupCheck.length===0){
    //
    //     automatabilityBisectingGroup = $chartSvg.append('g.bisecting-automation-group')
    //
    //     automatabilityBisectingGroup
    //         .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
    //
    //     automatabilityBisectingLine = automatabilityBisectingGroup.append('line.bisecting-line')
    //       .at('x1',xPadding)
    //       .at('y1',0)
    //       .at('x2',xMaxScaleValue)
    //       .at('y2',0)
    //
    //     automatabilityBisectingLabel=automatabilityBisectingGroup.append('text.bisecting-line-label')
    //
    //     automatabilityBisectingLabel.text('TRUCKERS')
    //
    //
    //       }
    //   else{}
    //
    //
    //
    //
    //   $chartSvg.select('g.least-similar-annotation')
    //     .st('opacity',0)
    //
    //   $chartSvg.select('g.most-similar-annotation')
    //     .st('opacity',0)
    //
    //   const Y_AXIS_ANNOTATION_HEIGHT =yMaxScaleValue*1.05
    //
    //   yAxisGroup.st('opacity',1)
    //   $automatability_LABEL.st('opacity',1)
    //
    //
    //   $chartSvg.selectAll('text.axis-label')
    //     .at('y',Y_AXIS_ANNOTATION_HEIGHT)
    //
    //   $jobCircles
    //     .transition()
    //   	.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
    //
    //
    //
    //
    //   yScale.domain([0,0.79])
    //
    //   automatabilityBisectingGroup
    //       .transition()
    //       .delay(2000)
    //       .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
    //       .st('opacity',0)
    //
    //   $jobCircles
    //   .st('opacity',d=>{
    //
    //     console.log(keyObjectJobAuto[d.id_compared]);
    //
    //     if (+keyObjectJobAuto[d.id_compared]>keyObjectJobAuto[d.id_selected]){return 0}
    //     else {return 1}
    //   })
    //   .transition()
    //   .delay(2000)
    //   .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
    //
    //
    //
    //
    // })
    // .on("leave", (e)=>{
    //   if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    //   else{}})
    // .addTo(controllerScatter)
    //
    // // Adding in color to scatterplot
    // $show_Earnings_Comparison.on('click',()=>{
    //   $jobCircles
    //     .transition()
    //   	.st('fill', d=>{
    //   		const jobSelectedWage = keyObjectJobWage[d.id_selected]
    //   		const jobComparedWage = keyObjectJobWage[d.id_compared]
    //   		const wageChange = jobComparedWage/jobSelectedWage;
    //   		return colorScale(wageChange)
    //   	})
    // })
    //
    //
    // const sceneJob2 = new ScrollMagic.Scene({
    //   triggerElement: ".show-similarity-auto-wage",
    //   offset:  0,
    //   duration: 1,
    //   triggerHook: 0
    // })
    // .on("enter", (e)=>{
    //
      //
      // $legendWages
      //   .st('visibility','visible')
      //
      // $jobCircles
      //   .transition()
      // 	.st('fill', d=>{
      //
      // 		const jobSelectedWage = keyObjectJobWage[d.id_selected]
      // 		const jobComparedWage = keyObjectJobWage[d.id_compared]
      // 		const wageChange = jobComparedWage/jobSelectedWage;
      //
      // 		return colorScale(wageChange)
      // 	})
      //   .transition()
      //   .delay(1000)
      //   .st('opacity', d=>{
      //     if (
      //         (keyObjectJobWage[d.id_selected]<keyObjectJobWage[d.id_compared] )
      //         &&
      //         (keyObjectJobAuto[d.id_selected]>keyObjectJobAuto[d.id_compared])
      //     ){return 1}
      //     else {return 0}
      //   })
      //
    //
    //
    // })
    // .on("leave", (e)=>{
    //   if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    //   else{}})
    // .addTo(controllerScatter)
    //
    //
    //
    //
    //     const sceneJob3 = new ScrollMagic.Scene({
    //       triggerElement: ".show-similarity-auto-wage-number",
    //       offset:  0,
    //       duration: 1,
    //       triggerHook: 0.5
    //     })
    //     .on("enter", (e)=>{
    //       $jobDropdownMenu
    //       .st('visibility','visible')
    //
    //       $legendjobNumber
    //         .st('visibility','visible')
    //
    //       $jobCircles
    //         .transition()
    //   			.at('r', d=>{
    //   				const wage=keyObjectJobNumber[d.id_compared];
    //   				return radiusScale(wage)
    //   			})
    //
    //     })
    //     .on("leave", (e)=>{
    //       if(e.target.controller().info("scrollDirection") == "REVERSE"){
    //
    //         $jobDropdownMenu
    //         .st('visibility','hidden')
    //
    //         $jobCircles
    //           .transition()
    //     			.at('r', 3)
    //
    //       }
    //       else{}})
    //       .addIndicators({name: "finalIndicator"})
    //     .addTo(controllerScatter)



//   })
// }
