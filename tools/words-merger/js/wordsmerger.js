$( document ).ready(function() {
	var wordLines1 = [], wordLines2 = [], wordLines3 = [], mergedWords = [], saveWords = [], sep, seperator, wrp = [], wrapper, spc, spacing;

	$("#mergeTheWords").on('click', function(event){
		event.preventDefault();
		//.results,.btn-copy,.btn-download,.btn-email,.btn-email,.mailResults,.mailOptions


		$('.btn-copy,.btn-download').css('display','inline-block');
		$('.results').css('display','block');
		$("html, body").animate({ scrollTop: $('.mergeOptions').offset().top -50 }, 1000);
		
		if ($("#mergedResults").val() != '' || mergedWords.length != 0) {
			wordLines1.length = 0;
			wordLines2.length = 0;
			wordLines3.length = 0;
			saveWords.length = 0;
			mergedWords.length = 0;
			wrp.length = 0;
			$("#mergedResults").text('');
		}
		seperator = $("input[name='separators']:checked").val();
		
		switch (seperator) {
			case 'sepNot':
				sep = '';
				break;
			case 'sepSpa':
				sep = ',';
				break;
			case 'sepDas':
				sep = '-';
				break;
			case 'sepPlu':
				sep = '+';
				break;
			case 'sepCus':
				sep = $("#customText").val();
				break;
			default:
				sep = '';
		}
		wrapper = $("input[name='wrappers']:checked").val();

		switch (wrapper) {
			case 'wrpNot':
				wrp.push('');
				wrp.push('');
				break;
			case 'wrapsqr':
				wrp.push('\[');
				wrp.push('\]');
				break;
			case 'wrapqte':
				wrp.push('\"');
				wrp.push('\"');
				break;
			case 'wrapsgl':
				wrp.push('\'');
				wrp.push('\'');
				break;
			default:
				wrp.push('');
				wrp.push('');
		}

		spacing = $("input[name='spacers']:checked").val();
		switch (spacing) {
			case 'yes':
				spc = ' ';
				break;
			case 'no':
				spc = '';
				break;
			default:
				spc = '';
		}

		if ($("#wordarea1").val() != '') {
			wordLines1 = $('#wordarea1').val().split('\n');
		}
		if ($("#wordarea2").val() != '') {
			wordLines2 = $('#wordarea2').val().split('\n');
		}
		if ($("#wordarea3").val() != '') {
			wordLines3 = $('#wordarea3').val().split('\n');
		}

// var str = "    ";
// if (!str.replace(/\s/g, '').length) {
// // string only contained whitespace (ie. spaces, tabs or line breaks)
// }
		
		if ($("#wordarea1").val() != '') {
			for (var i = 0; i < wordLines1.length; i++) {
				var line;
				if ($("#wordarea2").val() != '') {
					for (var j = 0; j < wordLines2.length; j++) {
						if ($("#wordarea3").val() != '') {
							for (var k = 0; k < wordLines3.length; k++) {
								line = wrp[0] + sep + replaceWhitespaces(wordLines1[i], sep) + spc + sep + replaceWhitespaces(wordLines2[j], sep) + spc + sep + replaceWhitespaces(wordLines3[k], sep) + wrp[1];
								
								if (!isInArray(wordLines1[i], saveWords)) {
									saveWords.push(wordLines1[i]);
								}
								if (!isInArray(wordLines2[j], saveWords)) {
									saveWords.push(wordLines2[j]);
								}
								if (!isInArray(wordLines3[k], saveWords)) {
									saveWords.push(wordLines3[k]);
								}

								mergedWords.push(line);
							}
						} else {
							line = wrp[0] + sep + replaceWhitespaces(wordLines1[i], sep) + spc + sep + replaceWhitespaces(wordLines2[j], sep) + wrp[1];

							if (!isInArray(wordLines1[i], saveWords)) {
								saveWords.push(wordLines1[i]);
							}
							if (!isInArray(wordLines2[j], saveWords)) {
								saveWords.push(wordLines2[j]);
							}

							mergedWords.push(line);
						}
					}
				} else if ($("#wordarea3").val() != '') {
					for (var k = 0; k < wordLines3.length; k++) {
						line = wrp[0] + sep + replaceWhitespaces(wordLines1[i], sep) + spc + sep + replaceWhitespaces(wordLines3[k], sep) + wrp[1];

						if (!isInArray(wordLines1[i], saveWords)) {
							saveWords.push(wordLines1[i]);
						}
						if (!isInArray(wordLines3[k], saveWords)) {
							saveWords.push(wordLines3[k]);
						}

						mergedWords.push(line);
					}
				} else {
					line = wrp[0] + sep + wordLines1[i] + wrp[1];
					mergedWords.push(line);
				}
			}

			$.ajax({    
				url:'../inc/insertmerge.php',
				type: 'post',
				data: {
					'amount': mergedWords.length,
					'words': saveWords,
				},
				success: function(data) {
				// this is for testing
					console.log('merged')
				}
			});
		} else {
			// No words!!!	
		}

		$("#resultCount").text(mergedWords.length);
		// $("#mergedResults").attr('rows', mergedWords.length);
		$("#mergedResults").text(mergedWords.join("\n"));

		$(".btn-copy").on("click", function(e){
			e.preventDefault();
			var copyTextarea = document.querySelector('#mergedResults');
			copyTextarea.select();

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				console.log('Copying text command was ' + msg);
			} catch (err) {
				console.log('Oops, unable to copy');
			}
		});

		$(".btn-download").on("click", function(e){
			e.preventDefault();
			var data = [];
			
			for (var i = 0; i < mergedWords.length; i++) {
				data.push(mergedWords[i]);
			};

			var csvContent = 'data:text/csv;charset=utf-8,';
			for (var i = 0; i < data.length; i++) {
				if (i < data.length) {
					csvContent += data[i].toString() + "\r\n";
				} else {
					csvContent += data[i].toString();
				}
			};

			data = encodeURI(csvContent);
			link = document.createElement('a');
			link.setAttribute('href', data);
			link.setAttribute('download', 'MergedWords.csv');
			link.click();
		});

		// $(".btn-email").on("click", function(e){
		// 	// $().toggle("show");
		// });

		function isInArray(value, array) {
			return array.indexOf(value) > -1;
		}

		function replaceWhitespaces(str, sep) {
			if (spacing == 'yes') {
				return str;
			} else{
				return str.replace(/\s/g, sep);
			}
		}
	});
});