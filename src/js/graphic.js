// import loadIntro from './truckerDevIntro';
import enterView from 'enter-view'
import scatter from './scatter';
// const controller = new ScrollMagic.Controller();

// import loadDevsAndTruckersSkills from './loadDevsAndTruckersSkills';
// import loadSingleAxisSimilarity from './singleAxisSimilarity';
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
  console.log({step});
  scatter.updateStep(step)
}


function setupScrollTriggers(){
  enterView({
    selector: '.section__scene',
    offset: 0.25,
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

  scatter
    .init()
    .then( () =>{
      // set up scroll triggers
      setupScrollTriggers()
    })
    .catch((err)=>{console.log(err);})

  const VIEWPORT_RATIO_HEIGHT = 1
  const VIEWPORT_RATIO_WIDTH = 0.9

  const chartSvg = d3.select("body")
    .select("figure.svg-container")
    .select("svg.scatter")

  chartSvg.at('height', ()=> viewportHeight * VIEWPORT_RATIO_HEIGHT)
    .at('width', ()=>viewportWidth * VIEWPORT_RATIO_WIDTH)
    .st('fill','#00000')

  // const mainSectionHeight = getHeight('#content')
  // loadDevsAndTruckersSkills()




  // const sceneStick = new ScrollMagic.Scene({
  //   triggerElement: ".svg-container",
  //   	offset: 0,
  //   	duration: mainSectionHeight,
  //   	triggerHook: 0
  //   })
  //   .setPin(".svg-container",{pushFollowers: false})
  //   .on("enter", (e)=>{
  //
  //   })
  //   .on("leave", (e)=>{
  //     if(e.target.controller().info("scrollDirection") == "REVERSE"){
  //         }
  //     else{}})
  //   .addIndicators({name: "indicatorScatter"})
  //   .addTo(controller)






    // const sceneLoadIntro = new ScrollMagic.Scene({
    //   triggerElement: ".svg-container",
    //   offset:  0,
    //   duration: 1,
    //   triggerHook: 0
    // })
    // .on("enter", (e)=>{
    //     loadIntro();
    // })
    // .on("leave", (e)=>{
    //   if(e.target.controller().info("scrollDirection") == "REVERSE"){
    //       }
    //   else{}})
    // .addTo(controller)


    // const sceneLoadSkillComparison = new ScrollMagic.Scene({
    //   triggerElement: ".two-jobs-all-skills",
    //   offset:  0,
    //   duration: 1,
    //   triggerHook: 0
    // })
    // // .addIndicators({name: ""})
    // .on("enter", (e)=>{
    //   loadDevsAndTruckersSkills()
    // })
    // .on("leave", (e)=>{
    //   if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    //   else{}})
    // .addTo(controller)


    // const sceneLoadScatter = new ScrollMagic.Scene({
    //   triggerElement: ".x-axis-scatter",
    //   offset:  0,
    //   duration: 1,
    //   triggerHook: 0
    // })
    // // .addIndicators({name: ""})
    // .on("enter", (e)=>{
    //   loadScatterplot()
    // })
    // .on("leave", (e)=>{
    //   if(e.target.controller().info("scrollDirection") == "REVERSE"){}
    //   else{}})
    // .addTo(controller)





// Buttons for stepper progression
  // const $TEMP_buttons_Container = d3.select('body').append('div.buttons-container')
  //
  // const $truckerCircle = $TEMP_buttons_Container.append('div.transition-button.trucker-circle').text('trucker')
  // const $truckerCircleAutomation = $TEMP_buttons_Container.append('div.transition-button.trucker-circle-automatability').text('trucker automation')
  // const $truckerDevAutomation = $TEMP_buttons_Container.append('div.transition-button.truckers-and-devs-automatability').text('truckers > developers?')
  // const $truckerSkill = $TEMP_buttons_Container.append('div.transition-button.truckers-devs-trucker-skill').text('trucker skill')
  // const $devSkill = $TEMP_buttons_Container.append('div.transition-button.truckers-devs-dev-skill').text('developer skill')
  //
  //
  // const $skills_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.all-skills').text('AllSkills')
  // const $skills_Difference_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.skill-difference').text('DifferenceInSkills')
  // const $skills_Stack_Difference_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.skill-stack-difference').text('StackDifference')
  //
  // const $skills_Difference_All_Jobs = $TEMP_buttons_Container.append('div.transition-button.all-skills-difference').text('StackAllSkills')
  //
  // const $showScatterplot =$TEMP_buttons_Container.append('div.transition-button.final-scatter').text('showScatter')
  //
  // const $show_XY_Axes_Similarity_All_Jobs =$TEMP_buttons_Container.append('div.transition-button.automation-similarity-axis').text('XY Axes Similarity')
  // const $show_Earnings_Comparison =$TEMP_buttons_Container.append('div.transition-button.earnings').text('Earnings')
  // const $show_Number_Jobs_Available =$TEMP_buttons_Container.append('div.transition-button.jobs-available').text('Number of Jobs')



  // $truckerCircle.on('click', ()=>loadIntro())
  // $skills_Two_Jobs.on('click', ()=>loadDevsAndTruckersSkills())
  // $showScatterplot.on('click',()=>loadScatterplot())


}

export default { init, resize };
