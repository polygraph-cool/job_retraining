
let mobile = false;
let viewportWidth = window.innerWidth;
let isMobile = viewportWidth < 700? true : false
let allData = null

const keyObjectJobName = {}
const keyObjectJobNumber = {}
const keyObjectJobAuto = {}
const keyObjectJobWage = {}

function selectJobData(allData, selectedJobID){

	const selectedJobData = allData.filter((item)=>{
		return item.id_selected === selectedJobID;
		// Why does this need a return statement while the X.length>6 doesn't?
	})

	return selectedJobData
}

function setupXScale(selectedJobData){

	const xScale = d3.scaleLinear()
		.domain(d3.extent(selectedJobData, function(d) { return d.similarity; }))
		.range([0, 800]);

	return xScale;
}


function resize() {}


function init() {

	const MAX_AUTO = 1
	const MIN_AUTO = 0
	const pathData = 'assets/data/'
	const fileNames = ['crosswalk','similarity']
	let files = []
	fileNames.forEach((category)=>{
		files.push(pathData+category+'.csv')
	})

	d3.loadData(...files, (err, response)=>{
		let crosswalk = response[0]
		let similarity= response[1]


		crosswalk.forEach((item)=>{
			item.id= +item.id;
			item.auto= +item.auto;
			item.wage= +item.wage;
			item.number= +item.number;
		})


		similarity.forEach((item)=>{
			item.similarity= +item.similarity;
			item.id_compared= +item.id_compared;
			item.id_selected= +item.id_selected;
		})

		allData = similarity;

		const chartSvg = d3.select("body").append("svg.scatter")

		chartSvg.at('height', 600)
			.at('width', 800)
			.st('fill','#00000')

		const first5Jobs=similarity.filter(item=>{
			return item.id_selected<5
		})



		let selectedJobData =	selectJobData(first5Jobs, 3)

		const yScale = d3.scaleLinear()
			.domain([MIN_AUTO,MAX_AUTO])
			.range([0, 600]);

		let xScale = setupXScale(selectedJobData)

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


		// const jobNames = crosswalk.map((d)=>{
		// 	let jobAndId = {}
		//
		// 	return keyObjectJobName[d.id_selected]
		// })
		// const uniqueJobNames = Array.from(new Set(jobNames));

		const jobButtons=d3.selectAll('div.job-button')
			.data(crosswalk)
			.enter()
			.append('div.job-button')

		jobButtons.st('height', 20)
			.st('width', 500)
			.text((d)=>{
				return d.job_name;
			})
			.on('click',(d)=>{
				const selectedJobID=d.id;
				const updatedData = selectJobData(allData, selectedJobID);
				const xScale = setupXScale(updatedData);

				d3.selectAll('circle.job').remove()

				let jobCircles = d3.select('svg.scatter')
					.selectAll('circle.job')
					.data(updatedData)
					.enter()
					.append('circle.job')

					console.log(updatedData);


				jobCircles
					.at('cx', d=>{return xScale(d.similarity)})
					.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
					.at('r', d=>{return 5})
					.st('stroke', 'black')
					.st('fill','white')

					jobCircles.on('mouseenter',(d)=>{
						const jobSelectedName = d3.select("div.job-selected-name");
						jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])

						const jobComparedName = d3.select("div.job-compared-name");
						jobComparedName.text("Compared job: "+keyObjectJobName[d.id_compared])

						const jobSelectedNumber = d3.select("div.job-selected-number");
						jobSelectedNumber.text("Main job quantity: "+keyObjectJobNumber[d.id_selected])

						const jobComparedNumber = d3.select("div.job-compared-number");
						jobComparedNumber.text("Compared job quantity: "+keyObjectJobNumber[d.id_compared])


					})
				// updateCircles(selectedJobID)
			})


		let jobCircles = chartSvg
			.selectAll('circle.job')
			.data(selectedJobData)
			.enter()
			.append('circle.job')




		jobCircles
			.at('cx', d=>{return xScale(d.similarity)})
			.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
			.at('r', d=>{return 5})
			.st('stroke', 'black')
			.st('fill','white')

		const jobSelectedName = d3.select("body").append("div.job-selected-name")
		const jobComparedName = d3.select("body").append("div.job-compared-name")
		const jobSelectedNumber = d3.select("body").append("div.job-selected-number")
		const jobComparedNumber = d3.select("body").append("div.job-compared-number")

		jobCircles.on('mouseenter',(d)=>{
			const jobSelectedName = d3.select("div.job-selected-name");
			jobSelectedName.text("Main job: "+keyObjectJobName[d.id_selected])

			const jobComparedName = d3.select("div.job-compared-name");
			jobComparedName.text("Compared job: "+keyObjectJobName[d.id_compared])

			const jobSelectedNumber = d3.select("div.job-selected-number");
			jobSelectedNumber.text("Main job quantity: "+keyObjectJobNumber[d.id_selected])

			const jobComparedNumber = d3.select("div.job-compared-number");
			jobComparedNumber.text("Compared job quantity: "+keyObjectJobNumber[d.id_compared])


		})







	})
}

export default { init, resize };
