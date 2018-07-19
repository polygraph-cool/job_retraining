
import enterView from 'enter-view';
import intro from './truckersAndDevs';
import skillStacking from './skillStacking';
import scatter from './scatter';

let mobile = false;
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let isMobile = viewportWidth < 700? true : false;

function getHeight(idSelector){
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var elementHeightOffset = 0
  var elementHeight = d3.select(idSelector)
  elementHeight = elementHeight.node()
  return elementHeight.getBoundingClientRect().height - h/2;
}

function getCurrentStep(index){
  const sel = d3.select(`[data-index='${index}']`);
	const step = sel.attr('data-step');
	// stepSel.classed('is-active', (d, i) => i === index);
  // console.log(index);
  console.log({step});
  intro.updateStep(step)
  skillStacking.updateStep(step)
  scatter.updateStep(step)
}


function setupScrollTriggers(){
  enterView({
    selector: '.section__scene',
    offset: 0.1,
    enter: el => {
      const index = +d3.select(el).attr('data-index');
      getCurrentStep(index);
    },
  exit: el => {
    let index = +d3.select(el).attr('data-index');
    index = Math.max(0, index - 1);
    getCurrentStep(index);
  }
});

}

function resize() {}

function init() {
  const VIEWPORT_RATIO_HEIGHT = 1
  const VIEWPORT_RATIO_WIDTH = 0.9
  const chartSvg = d3.select("body")
    .select("figure.svg-container")
    .select("svg.scatter")

  const heightMiscElDiv = document.getElementById('misc-chart-elements-container').offsetHeight;
  const heightSvg = viewportHeight-heightMiscElDiv;

  console.log("full viewport height: "+viewportHeight);
  console.log("misc el div height: "+heightMiscElDiv);
  console.log("svg height (leftovers): "+heightSvg);

  chartSvg
    // .at('height', (viewportHeight * VIEWPORT_RATIO_HEIGHT))
    .at('height', heightSvg)
    .at('width', (viewportWidth * VIEWPORT_RATIO_WIDTH))
    .st('fill','#00000')

  const tmpHt = d3.select('svg.scatter').at('height')

  console.log("svg height actual: "+tmpHt);

  d3.select('img.images-two-jobs-two-skills')
    .st('width', (viewportWidth * (VIEWPORT_RATIO_WIDTH-0.3)))

  d3.select('img.images-two-jobs-many-skills')
    .st('width', (viewportWidth * (VIEWPORT_RATIO_WIDTH-0.3)))

  d3.select('img.images-two-jobs-stacked-skills')
    .st('width', (viewportWidth * (VIEWPORT_RATIO_WIDTH-0.3)))

  d3.select('img.images-many-jobs-many-skills')
    .st('width', (viewportWidth * (VIEWPORT_RATIO_WIDTH-0.3)))





  intro
    .init()
    .then( ()=>{
      setupScrollTriggers()
    })
    .catch((err)=>{console.log(err);})

  skillStacking
    .init()
    .then( ()=>{
      setupScrollTriggers()
    })
    .catch((err)=>{console.log(err);})

  scatter
    .init()
    .then( () =>{
      // set up scroll triggers
      setupScrollTriggers()
    })
    .catch((err)=>{console.log(err);})



}

export default { init, resize };
