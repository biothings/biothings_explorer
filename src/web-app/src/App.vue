<script setup>
    import LoadingLogo from './components/LoadingLogo.vue'
    import { useMainStore } from './stores/general';
    import { delegate } from 'tippy.js';
    import { onMounted } from 'vue'

    let store = useMainStore();
    var currentTime = new Date();
    let year = currentTime.getFullYear();

    onMounted(()=>{
      delegate("#tippyRoot", {
        target: "[data-tippy-content]",
        trigger: "mouseenter",
        allowHTML: true,
        onShow(instance) {
          instance.setContent(instance.reference.dataset.tippyContent);
        },
      });
    });
</script>

<template>
  <LoadingLogo v-if="store.loading" class="w-32 absolute top-[45vh] left-[45vw] z-50"></LoadingLogo>
  <main id="tippyRoot">
    <RouterView />
  </main>
  <footer class="bg-stone-900 text-stone-600 p-6 text-center text-sm min-h-[20vh] flex items-center justify-center">
    <div>
      <p class="center-align">
        <b>BioThings Explorer</b> Copyright &copy; {{ year }} | <a class="link" href="https://biothings.io/" target="_blank" rel="nonopenner" >The Su/Wu Lab</a>.
      </p>
    </div>
  </footer>
</template>
