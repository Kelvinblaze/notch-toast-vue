<template>
  <div>
    <slot />
    <ClientOnly>
      <NotchToaster position="top-center" mode="attached" animation="fluid" />
    </ClientOnly>
  </div>
</template>
