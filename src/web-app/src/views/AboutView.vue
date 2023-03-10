<script setup>
import Logo from "../components/BTELogoVertical.vue"
import LinkOut from '../components/LinkOutIcon.vue'
import cytoscape from 'cytoscape'
import { onMounted } from 'vue'

import scripps from '../assets/img/scripps-logo.png'

const props = defineProps(['query'])

let elements = {
nodes: [
    { data: { id: 'andrew', name: 'Andrew Su \n Professor', color: 'hotpink' } },
    { data: { id: 'chunlei', name: 'Chunlei Wu \n Professor', color: 'coral' } },
    { data: { id: 'ginger', name: 'Ginger Tsueng \n Senior Research Scientist', color: '#2abcbd' } },
    { data: { id: 'marco', name: 'Marco A. Cano \n Research Programmer III', color: '#ffc656' } },
    { data: { id: 'colleen', name: 'Colleen Xu \n Research Programmer', color: 'white' } },
    { data: { id: 'jackson', name: 'Jackson Callaghan \n Research Programmer', color: 'violet' } },
    { data: { id: 'ayushi', name: 'Ayushi Agrawal \n Bioinformatician II', color: 'lightpink' } },
    { data: { id: 'yao', name: 'Yao Yao \n Staff Scientist', color: 'lightblue' } },
    { data: { id: 'ian', name: 'Ian Newman \n Molecular Biologist', color: 'salmon' } }
],
edges: [
    { data: { source: 'andrew', target: 'chunlei' } },
    { data: { source: 'andrew', target: 'marco' } },
    { data: { source: 'chunlei', target: 'ginger' } },
    { data: { source: 'chunlei', target: 'jackson' } },
    { data: { source: 'jackson', target: 'yao' } },
    { data: { source: 'jackson', target: 'ian' } },
    { data: { source: 'ginger', target: 'marco' } },
    { data: { source: 'jackson', target: 'ayushi' } },
    { data: { source: 'ayushi', target: 'chunlei' } },
    { data: { source: 'chunlei', target: 'colleen' } },
    { data: { source: 'ian', target: 'andrew' } },
    { data: { source: 'colleen', target: 'ginger' } },
    { data: { source: 'marco', target: 'yao' } }
]
}

function drawGraph() {
        let cy = cytoscape({
            container: document.getElementById("about-cy"),
            elements: [...elements.edges, ...elements.nodes],
            hideEdgesOnViewport: true,
            layout:{
                name: 'cose',
                directed: true,
                padding: 10
            },
            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'height': 180,
                    'width': 180,
                    'border-width': 6,
                    'border-color': 'data(color)',
                    'content': 'data(name)',
                    "text-valign": "top",
                    "text-halign": "center",
                    'color': 'white',
                    'text-outline-width': 0,
                    'background-fit': 'cover',
                    'text-wrap': 'wrap'
                })
                .selector('edge')
                .css({
                    'curve-style': 'unbundled-bezier',
                    'width': 7,
                    'target-arrow-shape': 'triangle',
                    'line-color': 'gray',
                    'target-arrow-color': 'gray'
                })
                .selector(':selected')
                .css({
                    'background-color': '#ea590a',
                    'line-color': 'white',
                    'target-arrow-color': 'white',
                    // 'source-arrow-color': 'white',
                    'text-outline-color': '#ea590a'
                }).selector('#chunlei')
                    .css({
                        'background-image': 'https://i.postimg.cc/xqWf8n0Y/chunlei.jpg'
                    })
                    .selector('#andrew')
                    .css({
                        'background-image': 'https://i.postimg.cc/V5SszdPD/andrew.jpg'
                    })
                    .selector('#ginger')
                    .css({
                        'background-image': 'https://i.postimg.cc/NKtQ8D9z/ginger.jpg'
                    })
                .selector('#marco')
                    .css({
                        'background-image': 'https://i.postimg.cc/hJPg6G08/marco.jpg'
                    })
                .selector('#colleen')
                    .css({
                        'background-image': 'https://i.postimg.cc/SJCyz3s9/colleen.jpg'
                    })
                .selector('#jackson')
                    .css({
                        'background-image': 'https://i.postimg.cc/XGtbrk6x/jackson.jpg'
                    })
                .selector('#yao')
                    .css({
                        'background-image': 'https://i.postimg.cc/FYxNTS0s/yao.jpg'
                    })
                .selector('#ayushi')
                    .css({
                        'background-image': 'https://i.postimg.cc/wy1zxbZ7/ayushi.jpg'
                    })
                .selector('#ian')
                    .css({
                        'background-image': 'https://i.postimg.cc/3yS7THLs/ian.jpg'
                    }),
        })

        cy.on('mouseover', 'edge', function(evt){
            evt.target.select()
        });

        cy.on('mouseout', 'edge', function(evt){
            evt.target.deselect()
        });

        
        // function makePopper(ele) {
        //     let ref = ele.popperRef();
        //     ele.tippy = tippy(document.createElement('div'), {
        //     getReferenceClientRect: ref.getBoundingClientRect,
        //     hideOnClick: false,
        //     placement:'top-start',
        //     trigger: 'manual', // mandatory
        //     arrow: true,
        //     interactive: true,
        //     allowHTML: true,
        //     theme:'light',
        //     animation: false,
        //     appendTo: document.body, // or append dummyDomEle to document.body
        //     onShow: function(instance){
        //         instance.setContent('<div class="purple white-text p-1 center-align"><h4 class="m-1">'+ele.id()+'</h4></div>')
        //     }
        //     });
        // }

        // function makePopperEdge(ele) {
        //     let ref = ele.popperRef();
        //     ele.tippy = tippy(document.createElement('div'), {
        //     getReferenceClientRect: ref.getBoundingClientRect,
        //     hideOnClick: false,
        //     trigger: 'manual', // mandatory
        //     placement:'top-start',
        //     arrow: true,
        //     animation: false,
        //     allowHTML: true,
        //     interactive: true,
        //     theme:'light',
        //     appendTo: document.body, // or append dummyDomEle to document.body
        //     onShow: function(instance){
        //         instance.setContent(`<div class="p-1 text-center">`+ele.data('name')+`</div>`)
        //     }
        //     });
        // }

        // cy.ready(function () {
        //     cy.elements().forEach(function (ele) {           
        //     if(!ele.isNode()){
        //         makePopperEdge(ele);
        //     }else{
        //         makePopper(ele);
        //         ele.data('weight', ele.connectedEdges().length ?  (ele.connectedEdges().length+150) : 150) ;
        //     }
        //     });
        // });

        // cy.elements().unbind('mouseover');
        // cy.elements().bind('mouseover', (event) => event.target.tippy.show());

        // cy.elements().unbind('mouseout');
        // cy.elements().bind('mouseout', (event) => event.target.tippy.hide());

        // cy.elements().bind('click', (event) => {
        //     event.target.select()
        //     cy.fit(event.target, 75)
        // });

        // cy.elements().unbind('drag');
        // cy.elements().bind('drag', (event) => event.target.tippy.popperInstance.update());

        // cy.layout({
        //     name: "concentric",
        //     avoidOverlap: true,
        //     avoidOverlapPadding: 200,
        //     minNodeSpacing: 200,
        // }).run();

        cy.maxZoom(2);
        cy.minZoom(.4)
        cy.fit();
}

onMounted(()=>{
    drawGraph();
})

</script>

<template>
  <div class="min-h-screen">
        <div class="w-full px-5 py-7 text-white ">
            <RouterLink to="/">Back</RouterLink>
        </div>
        <div class="w-3/4 m-auto my-7">
            <Logo class="w-64 mb-4"></Logo>
            <h1 class="text-orange-600 text-3xl mb-5">About BioThings Explorer</h1>
            <p class="text-white">
                BioThings Explorer is the "Google Maps" for biologists. It utilizes SmartAPI Specifications to build a network of APIs. And by traversing through the network, BioThings Explorer could help user identify potential paths connecting two biological entities through multiple API calls.
                <a class="text-blue-400" href="https://biothings.io/" target="_blank" rel="nonopenner">Learn more about BioThings <LinkOut></LinkOut></a>.
            </p>
            <div class="bg-network-2">
                <h1 class="text-orange-600 text-3xl mt-8">Our Team</h1>
                <div class="flex justify-end w-full">
                    <img :src="scripps" alt="Scripps Research" width="300">
                </div>
                <div id="about-cy"></div>
            </div>
        </div>
    </div>
</template>
