var http = require('http');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var baseUrl = 'http://www.imooc.com/learn/';
var videosId = [134,75,197,259,348,637];

function filterData(html){
	var $ = cheerio.load(html);
	var chapters = $('.chapter');
	var title = $('.hd.clearfix h2').text();
	var number = $('.js-learn-num').text();

	var courseData = {
		title : title,
		number : number,
		chapters : []
	};

	chapters.each(function(item){
		var chapter = $(this);
		chapter.find('strong').find('.chapter-info').remove();
		var chapterTitle = chapter.find('strong').text().replace(/\s+/g,' ').trim();
		var videos = chapter.find('.video').children('li');
		var chapterData = {
			chapterTitle : chapterTitle,
			videos : []
		};

		videos.each(function(item){
			var video = $(this).find('.J-media-item');
			var videoTitle = video.text().replace(/\s+/g,' ').replace('开始学习','');
			var videoId = video.attr('href').split('video/')[1].trim();
			chapterData.videos.push({
				title : videoTitle,
				id : videoId
			});
		})
		courseData.chapters.push(chapterData);
	})

	return courseData;
}

function printInfo(coursesData){
	coursesData.forEach(function(courseData){
		console.log(courseData.number + '人学过 ' + courseData.title + '\n');
	});

	coursesData.forEach(function(courseData){
		console.log('\n\n### '+courseData.title+'\n');
		courseData.chapters.forEach(function(item){
			console.log("\n" + item.chapterTitle);
			item.videos.forEach(function(video){
				console.log("【" + video.id + "】 " + video.title);
			})
		})
	})
}

function getPageAsync(url){
	return new Promise(function(resolve,reject){
		console.log("正在爬取" + url + '\n');

		http.get(url,function(res){
			var html = '';

			res.on('data',function(data){
				html += data;
			});

			res.on('end',function(){
				resolve(html);
			});
		}).on('error',function(e){
			reject(e);
			console.log('Fail to get data!');
		})
	})
}

var promiseArr = [];

videosId.forEach(function(id){
	promiseArr.push(getPageAsync(baseUrl+id));
})

Promise
	.all(promiseArr)
	.then(function(pages){
		var coursesData = [];

		pages.forEach(function(html){
			var courses = filterData(html);
			coursesData.push(courses);
		})

		coursesData.sort(function(a,b){
			return a.number < b.number;
		})

		printInfo(coursesData);
	});
