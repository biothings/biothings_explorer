<script setup>
import BTE from '../components/BTE.vue'
import Nav from '../components/Nav.vue'
import Logo from "../components/BTELogoVertical.vue"
import LinkOut from '../components/LinkOutIcon.vue'
</script>

<template>
  <div class="w-full min-h-[80vh] bg-network flex justify-start items-center">
    <div class="overflow-hidden">
      <BTE class="-left-80 -top-28 opacity-50"></BTE>
    </div>
    <div class="text-center flex-grow">
      <h6 class="text-orange-400 text-md">Installation successful!</h6>
      <h2 class="text-white text-3xl"><Logo class="w-3/4 inline"></Logo> Is Ready!</h2>
      <div class="flex p-3 justify-center items-center">
        <a class="main-btn-outline" href="https://biothings.io/explorer/" target="_blank" rel="nonopenner">
          Learn more about BTE <LinkOut></LinkOut>
        </a>
      </div>
      <div class="flex p-3 justify-center items-center mb-9">
        <router-link class="main-btn" :to="{name: 'try'}">
          Try BTE now
        </router-link>
      </div>
      <Nav></Nav>
    </div>
  </div>
</template>
