<script setup lang="ts">
import Company from './company/page.vue'
import Branch from './branch/page.vue'
import Location from './location/page.vue'
import Facility from './facility/page.vue'
import Department from './department/page.vue'
import Divisions from './division/page.vue'
import Section from './section/page.vue'
import Position from './position/page.vue'
import CostCenter from './cost-center/page.vue'

const tabs = [
    { value: 'companies', label: 'Companies' },
    { value: 'branches', label: 'Branches' },
    { value: 'location', label: 'Locations' },
    { value: 'facility', label: 'Facilities' },
    { value: 'divisions', label: 'Divisions' },
    { value: 'departments', label: 'Departments' },
    { value: 'sections', label: 'Sections' },
    { value: 'positions', label: 'Positions' },
    { value: 'cost-center', label: 'Cost Centers' },
]
</script>

<template>
    <main class="mx-auto max-w-screen-2xl px-0 py-0">
        <section class="mb-6 flex flex-col gap-1">
            <h1 class="text-2xl font-normal tracking-tight">
                Organization
            </h1>

            <p class="max-w-3xl text-muted-foreground">
                Manage company structure, branches, departments, positions, and work locations.
            </p>
        </section>

        <Tabs default-value="companies" class="w-full">
            <div class="mb-6 overflow-x-auto border-b">
                <TabsList class="flex h-auto w-max min-w-full justify-start bg-transparent p-0">
                    <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value"
                        class="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">
                        {{ tab.label }}
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="companies">
                <Company/>
            </TabsContent>
            
            <TabsContent value="branches">
                <Branch/>
            </TabsContent>
            
            <TabsContent value="location">
                <Location/>
            </TabsContent>

            <!--
              Facility duduk tepat di sebelah Location, dan itu
              disengaja: keduanya paling sering tertukar. Location =
              tempat orang ditempatkan; Facility = bangunan di dalamnya.
            -->
            <TabsContent value="facility">
                <Facility/>
            </TabsContent>

            <TabsContent value="divisions">
                <Divisions/>
            </TabsContent>

            <TabsContent value="departments">
                <Department/>
            </TabsContent>

            <TabsContent value="sections">
                <Section/>
            </TabsContent>

            <TabsContent value="positions">
                <Position/>
            </TabsContent>

            <TabsContent value="cost-center">
                <CostCenter/>
            </TabsContent>

        </Tabs>
    </main>
</template>