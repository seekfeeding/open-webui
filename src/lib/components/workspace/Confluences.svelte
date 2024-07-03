<script lang="ts">
	import { getContext } from 'svelte';
	import { refreshConfluences } from '$lib/apis/confluences';

	const i18n = getContext('i18n');
	const refresh = async () => {
		const result = await refreshConfluences(localStorage.token);
		if (result) {
			if (result.status == 1) {
				console.log("result message:" + result.message)
			} else if (result.status == 0) {
				console.log("result message:" + result.message)
			}
		}
	};
</script>

<div class="mb-3">
	<div class="flex justify-between items-center">
		<div class=" text-lg font-semibold self-center">{$i18n.t('Confluences')}</div>

		<div>
			<button class="px-2 py-0.5 space-x-1 flex h-fit items-center rounded-full transition bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
					   on:click={async () => {
							refresh();
						}}>
				Reload Confluences
			</button>

		</div>
	</div>
	<div class=" text-gray-500 text-xs mt-1">
		ⓘ {$i18n.t("Confuences Refresh Tips")}
	</div>
</div>


<hr class=" dark:border-gray-850 my-2.5" />

