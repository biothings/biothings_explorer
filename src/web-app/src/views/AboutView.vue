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
    { data: { id: 'madhumita', name: 'Madhumita Narayan \n Research Programmer', color: 'yellow' } },
    { data: { id: 'kristina', name: 'Kristina Hanspers \n Senior Research Associate', color: 'magenta' } },
    { data: { id: 'rohan', name: 'Rohan Juneja \n Intern', color: 'lightyellow' } },
    { data: { id: 'alex', name: 'Alex Pico \n Researcher', color: 'limegreen' } },
    { data: { id: 'yao', name: 'Yao Yao \n Staff Scientist', color: 'lightblue' } },
    { data: { id: 'ian', name: 'Ian Newman \n Molecular Biologist', color: 'salmon' } }
],
edges: [
    { data: { source: 'andrew', target: 'chunlei' } },
    { data: { source: 'andrew', target: 'marco' } },
    { data: { source: 'andrew', target: 'alex' } },
    { data: { source: 'chunlei', target: 'ginger' } },
    { data: { source: 'chunlei', target: 'jackson' } },
    { data: { source: 'chunlei', target: 'kristina' } },
    { data: { source: 'jackson', target: 'yao' } },
    { data: { source: 'jackson', target: 'rohan' } },
    { data: { source: 'jackson', target: 'ian' } },
    { data: { source: 'rohan', target: 'ian' } },
    { data: { source: 'alex', target: 'ian' } },
    { data: { source: 'ginger', target: 'marco' } },
    { data: { source: 'ginger', target: 'madhumita' } },
    { data: { source: 'jackson', target: 'ayushi' } },
    { data: { source: 'ayushi', target: 'chunlei' } },
    { data: { source: 'ayushi', target: 'madhumita' } },
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
                .selector('#alex')
                    .css({
                        'background-image': 'https://i.postimg.cc/CxSJBQQ9/alex.png'
                    })
                .selector('#rohan')
                    .css({
                        'background-image': 'https://i.postimg.cc/T3sLMygQ/biothings-explorer-md.png'
                    })
                .selector('#madhumita')
                    .css({
                        'background-image': 'https://i.postimg.cc/T3sLMygQ/biothings-explorer-md.png'
                    })
                .selector('#kristina')
                    .css({
                        'background-image': 'https://i.postimg.cc/T3sLMygQ/biothings-explorer-md.png'
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
                BioThings Explorer is an application that creates a federated knowledge graph that is composed of a network of biomedical web services. 
                BioThings Explorer leverages semantically precise annotations of inputs and outputs for each resource, and automates the chaining of web service calls to execute multi-step graph queries. Because there is no large, centralized knowledge graph to maintain, BioThing Explorer is distributed as a lightweight application that dynamically retrieves information at query time.  <a class="text-blue-400" href="https://biothings.io/" target="_blank" rel="nonopenner">Learn more about BioThings <LinkOut></LinkOut></a>.
            </p>
            <div class="bg-network-2">
                <h1 class="text-orange-600 text-3xl mt-8">Our Team</h1>
                <div class="flex justify-end w-full">
                    <img :src="scripps" alt="Scripps Research" width="300">
                </div>
                <div id="about-cy"></div>
                <div class="text-white">
                    <h5 class="text-orange-500">Past Contributors:</h5>
                    <ul>
                        <li>Jiwen Xin</li>
                        <li>Anders Riutta</li>
                        <li>Eric Zhou</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
