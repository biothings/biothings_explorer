<script setup>
    import cytoscape from 'cytoscape'
    // import popper from 'cytoscape-popper';
    // import tippy from 'tippy.js';
    import { onMounted } from 'vue'

    // cytoscape.use(popper);

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
            cy.fit();
    }

    onMounted(()=>{
        drawGraph();
    })

</script>

<template>
    <div class="cy" :id="props.query.id"></div>
</template>