var SelectTwo = function () {

};

SelectTwo.initSelect2 = function initSelect2($id, url, placename, formatRepo, formatRepoSelection) {
    var ac = $id.attr("allowClear");
    if (ac == 'true' || ac == true) {
        ac = true;
    } else {
        ac = false;
    }
    var $idselect = $id.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = {
                    //需要传递
                    entname: params.term
                }

                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (data) {
                // Tranforms the top-level key of the response object from 'items' to 'results'
                var itemList = [];
                for (var i = 0; i < data.length; i++) {
                    itemList.push({id: data[i].ID, text: data[i].TEXT});
                }
                return {
                    results: itemList,
                    pagination: {
                        more: false
                    }
                };
            }

            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
        },
        placeholder: placename,
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        language: "zh-CN",
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        allowClear: ac
    });
    return $idselect;
}