<template>
    <canvas id="explorer" width="540" height="540"></canvas>
</template>

<script>
import Zdog from 'zdog'

export default {
name: "BTE",
methods:{
    drawExplorer() {
        let illo = new Zdog.Illustration({
            element: '#explorer',
            dragRotate: true,
            scale: 1.5
        });

        var explorer = new Zdog.Group({
            addTo: illo,
        });

        var explorerframe = new Zdog.Group({
            addTo: illo,
        });

        let box = new Zdog.Box({
            addTo: illo,
            width: 100,
            height: 100,
            depth: 100,
            stroke: true,
            color: '#ff8e39',
            leftFace: '#ff8e39',
            rightFace: '#f15a24',
            topFace: '#ff8e39',
            bottomFace: '#f15a24',
            rotate: {
                x: .62,
                y: .8
            }
        });

        let b2 = box.copy({
            addTo: explorer,
            width: 150,
            height: 150,
            depth: 150,
            color: 'white',

            leftFace: '#f7c179',
            rightFace: '#c94b9c',
            topFace: '#4fd3c6',
            bottomFace: '#f9b570',
        })

        let b3 = box.copy({
            addTo: explorer,
            width: 200,
            height: 200,
            depth: 200,
            color: 'white',

            leftFace: '#f7c179',
            rightFace: '#bc57bc',
            topFace: '#4fd3c6',
            bottomFace: '#669be8',
        })

        // screen blend letters
        explorer.render = function (ctx) {
            ctx.globalCompositeOperation = 'multiply';
            Zdog.Group.prototype.render.apply(this, arguments);
        };

        explorerframe.render = function (ctx) {
            ctx.globalCompositeOperation = 'screen';
            Zdog.Group.prototype.render.apply(this, arguments);
        };

        // ----- animate ----- //

        function animate() {
            illo.updateRenderGraph();
            requestAnimationFrame(animate);
        }

        animate();

        let isSpinning = true;

        const update = () => {
            illo.rotate.y -= isSpinning ? 0.010 : 0;
            illo.updateRenderGraph();
            requestAnimationFrame(update);
        };

        update();

        }
    },
    mounted:function(){
        this.drawExplorer();
    }
}
</script>