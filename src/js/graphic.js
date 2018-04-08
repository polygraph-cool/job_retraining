
let mobile = false;
let viewportWidth = window.innerWidth;
let isMobile = viewportWidth < 700? true : false


function trimArray(array){
	const trimmedArray = array.slice(0,5);
	const indexedArray = newArray.map((d,i)=>({
		id: i,
		...d
	}))
	return indexedArray;
}

function combineJobArrays(arrayOfArrays){
	const arr1 = arrayOfArrays[0]
	const arr2 = arrayOfArrays[1]
	const arr3 = arrayOfArrays[2]

	const firstJoinedArray = []
	const secondJoinedArray =[]
	const thirdJoinedArray = []

arr1.forEach((itm, i) => {
  arr3.push(Object.assign({}, itm, arr2[i]));
});
}

function resize() {}


function init() {

	//
	// const pathData = 'assets/data/'
	// const files = []
	// const dataCategories = ['auto', 'relative_emp', 'similar', 'wage']
	//
	// dataCategories.forEach((category)=>{
	// 	files.push(pathData+category+'.csv')
	// })

	const laborersPath = 'assets/data/laborers.csv'
	const truckersPath = 'assets/data/truckers.csv'
	const athletesPath = 'assets/data/athletes.csv'
	const compManagersPath = 'assets/data/comp_managers.csv'

	const files = [laborersPath,truckersPath,athletesPath,compManagersPath]

	d3.loadData(...files, (err, response)=>{
		const laborersData = response[0]
		console.log(laborersData);
		const chartSvg = d3.select("body").append("svg.scatter")

		chartSvg.at('height', 600)
			.at('width', 800)
			.st('fill','#00000')

		const xScale = d3.scaleLinear()
    	.domain(d3.extent(laborersData, function(d) { return +d.similar_Construction_Laborers; }))
    	.range([0, 800]);

		const yScale = d3.scaleLinear()
			.domain(d3.extent(laborersData, function(d) { return +d.Automatability; }))
			.range([0, 600]);


		const jobCircles = chartSvg
			.selectAll('circle.job')
			.data(laborersData)
			.enter()
			.append('circle.job')

		jobCircles
			.at('cx', d=>{return xScale(+d.similar_Construction_Laborers)})
			.at('cy', d=>{return yScale(+d.Automatability)})
			.at('r', d=>{
				const employmentRatio =+d.Employment/912100;
				return employmentRatio*5
			})
			.st('stroke', 'black')
			.st('fill','white')

		const jobName = d3.select("body").append("div.job-name")
		const jobNumber = d3.select("body").append("div.job-number")

		jobCircles.on('mouseenter',(d)=>{
			const jobName = d3.select("div.job-name");
			jobName.text(d.Job_Compared)

			const jobNumber = d3.select("div.job-number");
			jobNumber.text(d.Employment)
		})



		// const cleanData = response.map(trimArray);




	})
}

export default { init, resize };
