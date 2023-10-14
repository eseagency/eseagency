/*-----------------------------------------------------------*/
/* Page Preperation                                          */
/*-----------------------------------------------------------*/


$(".wrk-flt__list-additions .wrk-flt__list > *").appendTo($(".wrk-flt__list").eq(0))
$(".wrk-flt__list-additions").remove()


textSplit($("[cb-textreveal-wrapper=filter]"))



function wrkIndexing() {
	$(".wrk-list__item").removeAttr("style")

	var items = $(".wrk-list__item:visible")

	items.each(function(index) {
		$(this).attr("style", `--index: ${index}`)
	})
	$(".wrk-list__wrapper").attr("style", `--length: ${items.length}`)

}

wrkIndexing()



/*-----------------------------------------------------------*/
/* Filter Button Functions                                   */
/*-----------------------------------------------------------*/


$("[cb-filter-button=filter]").click(function() {

	if ($(this).attr("cb-button-state") === "active") {return}

	$("[cb-filter-button=filter]").attr("cb-button-state", "inactive")
	$(this).attr("cb-button-state", "active")

	filterItems()
})


$("[cb-filter-button=reset]").click(function() {
	if ($(".wrk-flt__link[cb-filter-slug=all]").attr("cb-button-state") === "active") {return}

	$("[cb-filter-button=filter]").attr("cb-button-state", "inactive")
	$(".wrk-flt__link[cb-filter-slug=all]").attr("cb-button-state", "active")

	filterItems()
})



/*-----------------------------------------------------------*/
/* Filtering                                                 */
/*-----------------------------------------------------------*/


function filterItems() {
	$(".wrk-list__wrapper").removeClass("cb-animate-in")

	setTimeout(function() {
		var filters = "=" + $("[cb-button-state=active]").eq(0).attr("cb-filter-slug")

		if (filters === "=all") {filters = ""}

		$(`.wrk-list__item`).addClass("cb-filter-hidden")
		$(`.wrk-list__item [cb-filter-slug${filters}]`).parents(".wrk-list__item").removeClass("cb-filter-hidden")

		wrkIndexing()

		$(".wrk-list__wrapper").addClass("cb-animate-in")
	}, 800)
}



/*-----------------------------------------------------------*/
/* Load Page                                                 */
/*-----------------------------------------------------------*/

$(document).ready(function() {
	$("body").addClass("loaded")
	$(".wrk-list__wrapper").addClass("cb-animate-in")
})










