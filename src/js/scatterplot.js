
function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectJobData(data, selectedJobID){
	const selectedJobData = data.filter(item=> item.id_selected === selectedJobID)
	return selectedJobData
}

function setupXScale(selectedJobData){
	const xScale = d3.scaleLinear()
		.domain(d3.extent(selectedJobData, d=> d.similarity))
		.range([0, 800]);
	return xScale;
}

function compare(a,b) {
  if (a.imp < b.imp)
    return 1;
  if (a.imp > b.imp)
    return -1;
  return 0;
}


export default function loadScatterplot(){

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

		// console.log(skills);
		// console.log(crosswalkJobs);

		allData = similarity;

		const jobSelector = d3.select("body")
			.append("div.job-selector")

		const currentJobName = d3.select("body")
			.append("div.job-selected-name")

		const jobSelectedNumber = d3.select("body")
			.append("div.job-selected-number")

		const chartSvg = d3.select("svg.scatter")

		// chartSvg.at('height', 600)
		// 	.at('width', 800)
		// 	.st('fill','#00000')

		let selectedJobData =	selectJobData(similarity, 415);

		const yScale = d3.scaleLinear()
			.domain([MIN_AUTO,MAX_AUTO])
			.range([0, 600]);

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




		const jobDropdownMenu=d3.select('div.job-selector')
			.append('select.scatter-dropdown-menu')

		const jobButtons = jobDropdownMenu.selectAll('option.job-button')
			.data(crosswalk)
			.enter()
			.append('option.job-button')
			.at('value', d=>d.id)


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
					.at('r', d=>{
						const wage=keyObjectJobNumber[d.id_compared];
						return radiusScale(wage)
					})
					.st('stroke', 'black')

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
			.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
			.at('r', d=>{
				const wage=keyObjectJobNumber[d.id_compared];
				return radiusScale(wage)
			})
			.st('stroke', 'black')
			.st('fill', d=>{
				const jobSelectedWage = keyObjectJobWage[d.id_selected]
				const jobComparedWage = keyObjectJobWage[d.id_compared]
				const wageChange = jobSelectedWage/jobComparedWage;

				return colorScale(wageChange)
			})

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

			const jobSelectedName = d3.select("div.job-selected-name");
			jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])

			const jobComparedName = d3.select("div.job-compared-name");
			jobComparedName.text("Compared job: "+keyObjectJobName[d.id_compared])

			const jobSelectedNumber = d3.select("div.job-selected-number");
			jobSelectedNumber.text("Main job quantity: "+numberWithCommas(keyObjectJobNumber[d.id_selected]))

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
	})
}
