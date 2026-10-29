<script setup lang="ts">
function fakeApi(succeed = true) {
  return new Promise<{ message: string }>((res, rej) =>
    setTimeout(() => succeed ? res({ message: 'Profile updated' }) : rej(new Error('Server error')), 2000)
  )
}

async function runPromise(succeed: boolean) {
  try {
    await toast.promise(fakeApi(succeed), {
      loading: 'Saving changes...',
      success: (d) => d.message,
      error: (e) => e instanceof Error ? e.message : 'Something went wrong',
    })
  } catch {
    // toast.promise rethrows after showing the error toast; nothing more to do here
  }
}

function morphDemo() {
  const id = toast.loading('Processing KYC verification...')
  setTimeout(() => {
    toast.update(id, { title: 'Identity verified', type: 'success', duration: 3600, dismissible: false })
  }, 2500)
}

function withAction() {
  toast.error('Payment failed — card declined', {
    dismissible: true,
    action: {
      label: 'Retry',
      onClick: () => toast.loading('Retrying payment...'),
    },
  })
}
</script>

<template>
  <div style="padding:2rem;display:flex;flex-direction:column;gap:.75rem;max-width:360px">
    <h1 style="font-size:1.2rem;font-weight:600;margin-bottom:.5rem">notch-toast-vue playground</h1>
    <button @click="toast.show('New transaction received')">Default</button>
    <button @click="toast.success('Payment of ₦50,000 sent')">Success</button>
    <button @click="toast.error('Transaction declined')">Error</button>
    <button @click="toast.warning('Session expires in 5 minutes')">Warning</button>
    <button @click="toast.info('2-step verification enabled')">Info</button>
    <button @click="toast.loading('Fetching portfolio data...')">Loading</button>
    <button @click="withAction">Error + action</button>
    <button @click="morphDemo">Morph: loading → success</button>
    <button @click="runPromise(true)">Promise (success)</button>
    <button @click="runPromise(false)">Promise (error)</button>
    <button @click="toast.dismiss()">Dismiss</button>
  </div>
</template>
