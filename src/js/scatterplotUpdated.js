
function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectJobData(data, selectedJobID){
	const selectedJobDataAllJobs = data.filter(item=> item.id_selected === selectedJobID)
  const selectedJobData = selectedJobDataAllJobs.filter(item=> item.id_compared != item.id_selected)
	return selectedJobData
}

function setupXScale(selectedJobData){
  const chartSvg = d3.select("svg.scatter")
  const svgWidth = chartSvg.at('width')
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

function changeDropDown(d,i,n){

}

export default function loadScatterplotUpdated(){
  const controllerScatter = new ScrollMagic.Controller();

  let allData = null

  const keyObjectJobName = {}
  const keyObjectJobNumber = {}
  const keyObjectJobAuto = {}
  const keyObjectJobWage = {}
  const keyObjectSkillName = {}
  let selectedJobSkills = [0,0,0,0,0]
  let skills = []


	const MAX_AUTO = 1
	const MIN_AUTO = 0
	const pathData = 'assets/data/'
	const fileNames = ['crosswalk_jobs','similarity','crosswalk_skills','skills']
	let files = []
	fileNames.forEach((category)=>{
		files.push(pathData+category+'.csv')
	})

	d3.loadData(...files, (err, response)=>{
		let crosswalk    = response[0];
		let similarity   = response[1];
		let crosswalkSkills= response[2];
		skills= response[3]


		crosswalk.forEach((item)=>{
			item.id    = +item.id;
			item.auto  = +item.auto;
			item.wage  = +item.wage;
			item.number= +item.number;
		})

		similarity.forEach((item)=>{
			item.similarity = +item.similarity;
			item.id_compared= +item.id_compared;
			item.id_selected= +item.id_selected;
		})

		skills.forEach(item=>{
			item.id_selected= +item.id_selected;
			item.imp        = +item.imp;
			item.skill_id   = +item.skill_id;
			item.rank       = +item.rank;
		})

		crosswalkSkills.forEach(item=>{
			item.skill_id= +item.skill_id
		})

		allData = similarity;
    let selectedJobID = 415;
    let selectedJobData =	selectJobData(similarity, selectedJobID);

    const leastSimilarJob = findLeastSimilarJob(selectedJobData)
    const mostSimilarJob = findMostSimilarJob(selectedJobData)

    // console.log(leastSimilarJob);

		// const jobSelector = d3.select("body")
		// 	.append("div.job-selector")

    // const jobSelector=d3.select('.job-selector-div')

		const currentJobName = d3.select("body")
			.append("div.job-selected-name")

		const jobSelectedNumber = d3.select("body")
			.append("div.job-selected-number")


    const chartSvg = d3.select("svg.scatter")


    const VIEWPORT_RATIO_HEIGHT = 0.875
    const miscChartSections = d3.select('.misc-chart-elements-container')
    const miscChartSectionTitle = miscChartSections.select("div.chart-title-div")


    // Changing svg height to account for the now added 12.75% vH addition
    const svgHeight_PREUPDATE = chartSvg.at('height')
    chartSvg.at('height', (0.875*svgHeight_PREUPDATE))


    const svgWidth = chartSvg.at('width')
    const widthPercentage = 0.9;
    const xMaxScaleValue = svgWidth * widthPercentage;
    const xPadding = (1-widthPercentage)*svgWidth;

    const svgHeight = chartSvg.at('height')
    const heightPercentage = 0.9;
    const yMaxScaleValue = svgHeight * heightPercentage;
    // const yPadding = (1-heightPercentage)*svgHeight;
    const yPadding = (0.02)*svgHeight;


// Misc section setup
    miscChartSections
      .st('height', ()=> (1-VIEWPORT_RATIO_HEIGHT) * svgHeight + 'px')

    // miscChartSectionTitle
    //   .text('Which jobs should truckers transition to?')

    miscChartSectionTitle.select('.chart-title-pt1')
      .text('Which jobs should')

    miscChartSectionTitle.select('.chart-title-pt2')
      .text('1,789,094')

    miscChartSectionTitle.select('.chart-title-pt3')
      .text('truckers')

    miscChartSectionTitle.select('.chart-title-pt4')
      .text('earning')

    miscChartSectionTitle.select('.chart-title-pt5')
      .text('$82,000')

    miscChartSectionTitle.select('.chart-title-pt6')
      .text('yearly, transition to?')





    const introYAxisLocation = svgHeight/2;

		const yScale = d3.scaleLinear()
			.domain([MIN_AUTO,MAX_AUTO])
			.range([0+yPadding, yMaxScaleValue]);

		let xScale = setupXScale(selectedJobData)

		const colorScale = d3.scaleLinear()
			.domain([5, 2, 1.25, 1.1, 0.9,.75, 0.5, 0.2])
			.range(['#a50026','#d73027','#f46d43','#fee090','#e0f3f8','#74add1','#4575b4','#313695'])

		const radiusScale = d3.scaleSqrt()
			.domain([0,d3.max(crosswalk, (d)=>{return d.wage})])
			.range([0,6])


		// Setting up transition object
		crosswalk.forEach(job=>{
			keyObjectJobName[job.id]=job.job_name;
		})

		crosswalk.forEach(job=>{
			keyObjectJobNumber[job.id]=job.number;
		})

		crosswalk.forEach(job=>{
			keyObjectJobAuto[job.id]=job.auto;
		})

		crosswalk.forEach(job=>{
			keyObjectJobWage[job.id]=job.wage;
		})

		crosswalkSkills.forEach(skill=>
			keyObjectSkillName[skill.skill_id]=skill.skill
		)

// Removing skill rectangles from visibility
    d3.selectAll('g.all-skills')
      .st('opacity',0)

    d3.selectAll('g.skill-section')
      .st('opacity',0)

// Creating job dropdown menu
		const jobDropdownMenu=d3.select('div.job-selector-div')
			.append('select')
      .at('class', 'scatter-dropdown-menu')
      .st('visibility','hidden')

// Setting appropriate values for jobDropDown menu, in line with bootstrap picker
    // jobDropdownMenu
    //   .at('data-show-subtext', true)
    //   .at('data-live-search', true)


		const jobButtons = jobDropdownMenu.selectAll('option.job-button')
			.data(crosswalk)
			.enter()
			.append('option.job-button')
			.at('value', d=>d.id)
      .at('data-subtext', d=> d.auto * 100+"%" )

		jobButtons.text((d)=>{
				return d.job_name;
			})




		jobDropdownMenu
			.on('change',(d,i,n)=>{
				const selectedJobID=eval(d3.select(n[i]).property('value'))
				// d3.select(this).property('value'));

				console.log(selectedJobID);
				const updatedData = selectJobData(allData, selectedJobID);
				const xScale = setupXScale(updatedData);

        const currentJobId=updatedData[0].id_selected;

        miscChartSectionTitle.select('.chart-title-pt2')
          .text(numberWithCommas(keyObjectJobNumber[currentJobId]))

        miscChartSectionTitle.select('.chart-title-pt3')
          .text(keyObjectJobName[currentJobId])

        miscChartSectionTitle.select('.chart-title-pt4')
          .text('earning')

        miscChartSectionTitle.select('.chart-title-pt5')
          .text('$'+numberWithCommas(keyObjectJobWage[currentJobId]))

        yScale.domain([0,keyObjectJobAuto[currentJobId]])

        // console.log(keyObjectJobAuto[updatedData[0].id_selected]);

				d3.selectAll('circle.job').remove()

				let jobCircles = d3.select('svg.scatter')
					.selectAll('circle.job')
					.data(updatedData)
					.enter()
					.append('circle.job')


				jobCircles
					.at('cx', d=>{return xScale(d.similarity)})
          .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
          .st('fill', d=>{
            const jobSelectedWage = keyObjectJobWage[d.id_selected]
            const jobComparedWage = keyObjectJobWage[d.id_compared]
            const wageChange = jobSelectedWage/jobComparedWage;
            return colorScale(wageChange)
          })
          .st('opacity',d=>{
            if (+keyObjectJobAuto[d.id_compared]>keyObjectJobAuto[d.id_selected]){return 0}
            else {return 1}
          })
					.st('stroke', 'black')
          .at('r', d=>{
    				const wage=keyObjectJobNumber[d.id_compared];
    				return radiusScale(wage)
    			})




					jobCircles.on('mouseenter',(d,i,n)=>{

						const jobTooltip = d3.select("div.jobTooltip")

						jobTooltip.st('visibility','visible')

						const xCoord = d3.select(n[i])
							.at("cx")

						const yCoord = d3.select(n[i])
							.at("cy")

						jobTooltip.st("left", (xCoord+"px") )
							.st("top", (yCoord+"px") )

						selectedJobSkills = selectJobData(skills, d.id_compared);
						selectedJobSkills= selectedJobSkills.sort(compare)

						const jobSelectedName = d3.select("div.job-selected-name");
						jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])

						const jobComparedName = d3.select("div.job-compared-name");
						jobComparedName.text("Compared job: "+keyObjectJobName[d.id_compared])

						const jobSelectedNumber = d3.select("div.job-selected-number");
						jobSelectedNumber.text("Main job quantity: "+ numberWithCommas(keyObjectJobNumber[d.id_selected]))

						const jobComparedNumber = d3.select("div.job-compared-number");
						jobComparedNumber.text("Compared job quantity: "+ numberWithCommas(keyObjectJobNumber[d.id_compared]))

						const jobSkillsContainer = jobTooltip.select('div.job-skills-container')

						const jobSkillsBarRow = jobSkillsContainer.selectAll('div.bar-container')

						const jobSkillsNames = jobSkillsContainer.selectAll("div.job-bar-name")
							.data(selectedJobSkills)

						const jobSkillsBars  = jobSkillsContainer.selectAll("div.job-bar")
							.data(selectedJobSkills)

						const jobSkillsValues= jobSkillsContainer.selectAll("div.job-bar-value")
							.data(selectedJobSkills)

						console.log(selectedJobSkills);

						jobSkillsBars.st('height','20px')
							.st('width', skill=> {
								return skill.imp+'px'
							})
							.st('background','black')

						jobSkillsNames.text(skill=>{
							return keyObjectSkillName[skill.skill_id]
						})

						jobSkillsValues.text(skill=>{
							return skill.imp;
						})
					})
					.on('mouseleave', ()=>{
						jobTooltip.st('visibility','hidden')
					})
			})


		let jobCircles = chartSvg
			.selectAll('circle.job')
			.data(selectedJobData)
			.enter()
			.append('circle.job')

      jobCircles
        .at('cx', d=>{return xScale(d.similarity)})
        .at('cy', introYAxisLocation)
        .st('fill', 'white')
        .st('stroke', 'black')
        .at('r','3')



    // Creating titles
    // const chartTitle = chartSvg.append('text.chart-title')
    //
    // chartTitle
    //   .at('x',svgWidth/2)
    //   .at('y',yPadding/2)
    //   .st('text-anchor','middle')
    //   .text('Which careers should truckers transition to?')

    // Note: adding titles in via div


    // Creating annotations elements

    const leastSimilarJob_ANNOTATION = chartSvg.append('g.least-similar-annotation')
    const mostSimilarJob_ANNOTATION = chartSvg.append('g.most-similar-annotation')

    const leastSimilarJob_LINE = leastSimilarJob_ANNOTATION.append('line')
    const mostSimilarJob_LINE = mostSimilarJob_ANNOTATION.append('line')

    const leastSimilarJob_TEXT = leastSimilarJob_ANNOTATION.append('text')
    const mostSimilarJob_TEXT = mostSimilarJob_ANNOTATION.append('text')



    // Setting text to read the right annotations

    leastSimilarJob_TEXT.text(keyObjectJobName[(leastSimilarJob[0].id_compared)])
    mostSimilarJob_TEXT.text(keyObjectJobName[(mostSimilarJob[0].id_compared)])
      .st('text-anchor', 'end')
    // Positioning annotation elements
    const verticalLabelPositioningShorter =introYAxisLocation*0.8;
    const verticalLabelPositioningTaller =introYAxisLocation*0.6;

    const lineHeightLeastSimilarJob = introYAxisLocation - verticalLabelPositioningShorter
    const lineHeightMostSimilarJob = introYAxisLocation - verticalLabelPositioningTaller

    leastSimilarJob_ANNOTATION
      .at('transform', d=>{
        const xTranslate = xScale(leastSimilarJob[0]['similarity']);
        return 'translate('+xTranslate+','+verticalLabelPositioningShorter +')'
      })

    mostSimilarJob_ANNOTATION
      .at('transform', d=>{
        const xTranslate = xScale(mostSimilarJob[0]['similarity']);
        return 'translate('+xTranslate+','+verticalLabelPositioningTaller +')'
      })

    leastSimilarJob_LINE
      .at('x1',0)
      .at('y1',0)
      .at('x2',0)
      .at('y2',lineHeightLeastSimilarJob)
      .st('stroke-width',1)
      .st('stroke','black')

    mostSimilarJob_LINE
      .at('x1',0)
      .at('y1',0)
      .at('x2',0)
      .at('y2',lineHeightMostSimilarJob)
      .st('stroke-width',1)
      .st('stroke','black')

    // Adding an x axis label to the chart

    const xAxisLabel = chartSvg.append('text.axis-label similarity')
    const xAxisLabelHeight = introYAxisLocation * 1.1
    // const svgWidth = chartSvg.at('width')


    xAxisLabel
      .at('x', svgWidth/2 )
      .at('y',xAxisLabelHeight)
      .text('SKILL SIMILARITY TO TRUCKERS')
      .st('text-anchor','middle')

    // Adding max and min similarity/ y-axis labels
    const maxSimilarityLabel = chartSvg.append('text.axis-label max-similarity')
    const minSimilarityLabel = chartSvg.append('text.axis-label min-similarity')

    const xAxisMaxMinLabelHeight = introYAxisLocation * 1.05

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

    const yAxisGroup = chartSvg.append("g.scatter-y-axis")
      .attr("transform", "translate("+xPadding+",0)")
      .call(yAxisLabel)
      .st('opacity',0)

    const automatability_LABEL = chartSvg.append('text.scatter-label-y-axis')

    automatability_LABEL
      .at('transform',`translate(${xPadding},${introYAxisLocation}) rotate(270)`)
      .st('text-anchor','middle')
      .st('opacity',0)
      .text('AUTOMATABILITY LIKELIHOOD')




		const jobTooltip = d3.select("div.svg-container").append("div.jobTooltip")

		const jobSelectedName = d3.select("div.job-selected-name")

		const jobComparedName = jobTooltip.append("div.job-compared-name")
		// const jobSelectedNumber = d3.select("div.job-selected-number")
		const jobComparedNumber = jobTooltip.append("div.job-compared-number")
		const jobSkillsContainer =jobTooltip.append("div.job-skills-container")

		const jobSkillsBarRow = jobSkillsContainer.selectAll('div.job-bar-container')
			.data(selectedJobSkills)
			.enter()
			.append('div.bar-container')

		const jobSkillsNames = jobSkillsBarRow.append("div.job-bar-name").data(selectedJobSkills).enter()
		const jobSkillsBars  = jobSkillsBarRow.append("div.job-bar").data(selectedJobSkills).enter()
		const jobSkillsValues= jobSkillsBarRow.append("div.job-bar-value").data(selectedJobSkills).enter()

		jobCircles.on('mouseenter',(d,i,n)=>{

			selectedJobSkills = selectJobData(skills, d.id_compared);
			selectedJobSkills = selectedJobSkills.sort(compare);

			const jobTooltip = d3.select("div.jobTooltip")

			jobTooltip.st('visibility','visible')

			const xCoord = d3.select(n[i])
				.at("cx")

			const yCoord = d3.select(n[i])
				.at("cy")

			jobTooltip.st("left", (xCoord+"px") )
				.st("top", (yCoord+"px") )

			// const jobSelectedName = d3.select("div.job-selected-name");
			// jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])
      //
			const jobComparedName = d3.select("div.job-compared-name");
			jobComparedName.text("Compared job: "+keyObjectJobName[d.id_compared])

			// const jobSelectedNumber = d3.select("div.job-selected-number");
			// jobSelectedNumber.text("Main job quantity: "+numberWithCommas(keyObjectJobNumber[d.id_selected]))
      //
			const jobComparedNumber = d3.select("div.job-compared-number");
			jobComparedNumber.text("Compared job quantity: "+numberWithCommas(keyObjectJobNumber[d.id_compared]))


			const jobSkillsContainer = jobTooltip.select('div.job-skills-container')

			const jobSkillsBarRow = jobSkillsContainer.selectAll('div.bar-container')

			const jobSkillsNames = jobSkillsContainer.selectAll("div.job-bar-name")
				.data(selectedJobSkills)

			const jobSkillsBars  = jobSkillsContainer.selectAll("div.job-bar")
				.data(selectedJobSkills)

			const jobSkillsValues= jobSkillsContainer.selectAll("div.job-bar-value")
				.data(selectedJobSkills)

			console.log(selectedJobSkills);

			jobSkillsBars.st('height','20px')
				.st('width', skill=> {
					return skill.imp+'px'
				})
				.st('background','black')

			jobSkillsNames.text(skill=>{
				return keyObjectSkillName[skill.skill_id]
			})

			jobSkillsValues.text(skill=>{
				return skill.imp;
			})
		})
		.on('mouseleave', ()=>{
			jobTooltip.st('visibility','hidden')
		})


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

    const sceneJob1 = new ScrollMagic.Scene({
      triggerElement: ".xy-axes-scatter",
      offset:  0,
      duration: 1,
      triggerHook: 0
    })
    .on("enter", (e)=>{



      let automatabilityBisectingGroup;
      let automatabilityBisectingLine;
      let automatabilityBisectingLabel;

      let automatabilityBisectingGroupCheck = $(".bisecting-automation-group");

      if(automatabilityBisectingGroupCheck.length===0){

        automatabilityBisectingGroup = chartSvg.append('g.bisecting-automation-group')

        automatabilityBisectingGroup
            .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')

        automatabilityBisectingLine = automatabilityBisectingGroup.append('line.bisecting-line')
          .at('x1',xPadding)
          .at('y1',0)
          .at('x2',xMaxScaleValue)
          .at('y2',0)

        automatabilityBisectingLabel=automatabilityBisectingGroup.append('text.bisecting-line-label')

        automatabilityBisectingLabel.text('TRUCKERS')


          }
      else{}




      chartSvg.select('g.least-similar-annotation')
        .st('opacity',0)

      chartSvg.select('g.most-similar-annotation')
        .st('opacity',0)

      const yAxisAnnotationsHeight =yMaxScaleValue*1.05

      yAxisGroup.st('opacity',1)
      automatability_LABEL.st('opacity',1)


      chartSvg.selectAll('text.axis-label')
        .at('y',yAxisAnnotationsHeight)

      jobCircles
        .transition()
      	.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})




      yScale.domain([0,0.79])
      const scene1Delay = 2000

      automatabilityBisectingGroup
          .transition()
          .delay(scene1Delay)
          .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
          .st('opacity',0)

      jobCircles
      .st('opacity',d=>{
        if (+keyObjectJobAuto[d.id_compared]>keyObjectJobAuto[d.id_selected]){return 0}
        else {return 1}
      })
      .transition()
      .delay(scene1Delay)
      .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})




    })
    .on("leave", (e)=>{
      if(e.target.controller().info("scrollDirection") == "REVERSE"){

        yScale.domain([0,1]);
        const scene1Delay = 2000;

        automatabilityBisectingGroup
          .transition()
          .st('opacity', 1)
          .at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')

        jobCircles
        .transition()
        .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
        .transition()
        .delay(scene1Delay)
        .st('opacity',d=>{     return 1
          // if (+keyObjectJobAuto[d.id_compared]>keyObjectJobAuto[d.id_selected]){return 0}
          // else {return 1}
        })

        // leastSimilarJob_ANNOTATION
        // mostSimilarJob_ANNOTATION
        // leastSimilarJob_LINE
        // mostSimilarJob_LINE
        // leastSimilarJob_TEXT
        // mostSimilarJob_TEXT
      }
      else{}})
    .addTo(controllerScatter)

    // Adding in color to scatterplot
    $show_Earnings_Comparison.on('click',()=>{
      jobCircles
        .transition()
      	.st('fill', d=>{
      		const jobSelectedWage = keyObjectJobWage[d.id_selected]
      		const jobComparedWage = keyObjectJobWage[d.id_compared]
      		const wageChange = jobSelectedWage/jobComparedWage;
      		return colorScale(wageChange)
      	})
    })


    const sceneJob2 = new ScrollMagic.Scene({
      triggerElement: ".show-similarity-auto-wage",
      offset:  0,
      duration: 1,
      triggerHook: 0
    })
    .on("enter", (e)=>{
      jobCircles
        .transition()
      	.st('fill', d=>{
      		const jobSelectedWage = keyObjectJobWage[d.id_selected]
      		const jobComparedWage = keyObjectJobWage[d.id_compared]
      		const wageChange = jobSelectedWage/jobComparedWage;
      		return colorScale(wageChange)
      	})
        .transition()
        .delay(1000)
        .st('opacity', d=>{
          if (
              (keyObjectJobWage[d.id_selected]<keyObjectJobWage[d.id_compared] )
              &&
              (keyObjectJobAuto[d.id_selected]>keyObjectJobAuto[d.id_compared])
          ){return 1}
          else {return 0}
        })

    })
    .on("leave", (e)=>{
      if(e.target.controller().info("scrollDirection") == "REVERSE"){

        jobCircles
        .st('opacity', 1)
        .transition()
        .delay(1000)
        .st('fill', '#FFF')
      }
      else{}})
    .addTo(controllerScatter)




        const sceneJob3 = new ScrollMagic.Scene({
          triggerElement: ".show-similarity-auto-wage-number",
          offset:  0,
          duration: 1,
          triggerHook: 0.5
        })
        .on("enter", (e)=>{
          jobDropdownMenu
          .st('visibility','visible')

          jobCircles
            .transition()
      			.at('r', d=>{
      				const wage=keyObjectJobNumber[d.id_compared];
      				return radiusScale(wage)
      			})

        })
        .on("leave", (e)=>{
          if(e.target.controller().info("scrollDirection") == "REVERSE"){

            jobDropdownMenu
            .st('visibility','hidden')

            jobCircles
              .transition()
        			.at('r', 3)

          }
          else{}})
          .addIndicators({name: "finalIndicator"})
        .addTo(controllerScatter)



  })
}
