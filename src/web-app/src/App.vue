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
  <footer class="bg-stone-900 text-stone-500 p-6 text-center text-sm min-h-[20vh] flex items-center justify-center">
    <div class="container m-auto space-y-2">
      <div class="flex justify-around items-center mb-2">
        <img src="@/assets/img/nih-logo.png" width="200" alt="NIH">
        <img src="@/assets/img/ncats-logo.png" width="200" alt="NCATS">
      </div>
      <p class="center-align">
        Support for this work was provided by the <a class="link" href="https://ncats.nih.gov/" target="_blank">National Center for Advancing Translational Sciences</a>, National Institutes of Health, through the <a class="link" href="https://ncats.nih.gov/translator" target="_blank">Biomedical Data Translator program</a>, awards OT2TR003427 and OT2TR003445
      </p>
      <p class="center-align">
        <b>BioThings Explorer</b> Copyright &copy; {{ year }} | <a class="link" href="https://biothings.io/" target="_blank" rel="nonopenner" >The Su/Wu Lab</a>.
      </p>
    </div>
  </footer>
</template>
