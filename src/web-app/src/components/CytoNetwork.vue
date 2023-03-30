<script setup>
    import cytoscape from 'cytoscape'
    import { onMounted } from 'vue'

    const props = defineProps(['query'])

    function drawGraph() {
            let cy = cytoscape({
                container: document.getElementById(props.query.id),
                elements: [...props.query.elements.edges, ...props.query.elements.nodes],
                hideEdgesOnViewport: true,
                layout:{
                    minNodeSpacing: 12,
                },
                style: cytoscape.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(name)',
                        "text-valign": "top",
                        "text-halign": "center",
                        'color': 'white',
                        'text-outline-width': 0,
                        'background-color': 'data(color)',
                        'text-wrap': 'wrap'
                    })
                    .selector('edge')
                    .css({
                        'curve-style': 'unbundled-bezier',
                        'content': 'data(name)',
                        'color': 'lightyellow',
                        'font-weight': 'bold',
                        "font-size": "12px",
                        'width': 3,
                        'target-arrow-shape': 'triangle',
                        'line-color': '#ea590a',
                        'target-arrow-color': '#ea590a'
                    })
                    .selector(':selected')
                    .css({
                        'background-color': '#ea590a',
                        'line-color': 'white',
                        'target-arrow-color': 'white',
                        'source-arrow-color': 'white',
                        'text-outline-color': '#ea590a'
                    }),
            })

            cy.on('mouseover', 'edge', function(evt){
                evt.target.select()
            });

            cy.on('mouseout', 'edge', function(evt){
                evt.target.deselect()
            });

            cy.maxZoom(2);
            cy.minZoom(1);
            cy.fit();
    }

    onMounted(()=>{
        drawGraph();
    })

</script>

<template>
    <div class="cy" :id="props.query.id"></div>
</template>