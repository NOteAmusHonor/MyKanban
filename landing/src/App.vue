<script setup lang="ts">
import SiteNav from '@/components/sections/SiteNav.vue'
import SiteFooter from '@/components/sections/SiteFooter.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import OfflineAiSection from '@/components/sections/OfflineAiSection.vue'
import LiveAiSimulationSection from '@/components/sections/LiveAiSimulationSection.vue'
import FeatureGrid from '@/components/sections/FeatureGrid.vue'
import AiIntegrationSection from '@/components/sections/AiIntegrationSection.vue'
import LiveSyncSection from '@/components/sections/LiveSyncSection.vue'
import LocalFirstSection from '@/components/sections/LocalFirstSection.vue'
import InstallationSection from '@/components/sections/InstallationSection.vue'
import EmbedAsLibrarySection from '@/components/sections/EmbedAsLibrarySection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
</script>

<template>
  <ScrollProgress />
  <SiteNav />
  <main>
    <HeroSection />
    <OfflineAiSection />
    <LiveAiSimulationSection />
    <FeatureGrid />
    <AiIntegrationSection />
    <LiveSyncSection />
    <LocalFirstSection />
    <InstallationSection />
    <EmbedAsLibrarySection />
    <FaqSection />
    <CtaSection />
  </main>
  <SiteFooter />
</template>

<style scoped></style>
