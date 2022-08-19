// ==UserScript==
// @name         购物优惠券省钱助手【淘宝】，【天猫】，【京东】，历史价格，购物比价， 一键领取隐藏优惠券，长期更新，放心下载
// @namespace    http://www.ergirl.com/
// @version      1.0.13
// @description  一键领取【淘宝】，【天猫】，【京东】隐藏优惠券，购物比价，查看商品历史价格，助您购物省钱
// @author       jares chiang
// @grant        none
// @include      *://*.tmall.com/*
// @include      *://*.taobao.com/*
// @include      *://*.tmall.hk/*
// @include      *://*.jd.com/*
// @include      *://*.jd.hk/*
// @exclude      *://passport.jd.com/*
// @exclude      *://uland.taobao.com/*
// @license      MIT
// @original-license MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.3/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.1.1/echarts.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/1.0.1/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/js/swiper.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// basic
// @require https://greasyfork.org/scripts/441330-%E5%85%AC%E5%85%B1%E5%BA%93js/code/%E5%85%AC%E5%85%B1%E5%BA%93js.js?version=1049610
// @require https://greasyfork.org/scripts/441331-md5/code/md5.js?version=1026891
// ttList
// ttDetail
// ttTop
// @require https://greasyfork.org/scripts/441333-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E5%A4%B4%E9%83%A8%E6%8E%A8%E8%8D%90js/code/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E5%A4%B4%E9%83%A8%E6%8E%A8%E8%8D%90js.js?version=1026914
// jdHome
// @require https://greasyfork.org/scripts/441334-%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5js/code/%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5js.js?version=1079218
// jdList
// @require https://greasyfork.org/scripts/441335-%E4%BA%AC%E4%B8%9C%E5%88%97%E8%A1%A8js/code/%E4%BA%AC%E4%B8%9C%E5%88%97%E8%A1%A8js.js?version=1079215
// jdDetail
// @require https://greasyfork.org/scripts/441336-%E4%BA%AC%E4%B8%9C%E8%AF%A6%E6%83%85js/code/%E4%BA%AC%E4%B8%9C%E8%AF%A6%E6%83%85js.js?version=1030992
// jdTopRec

// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// ==/UserScript==

(function () {
	("use strict");
	// --------------------列表功能开始--------------------
	/**
	 * @description: 查询列表优惠券
	 * @param {*} appkey
	 * @param {*} sid
	 * @param {*} pid
	 * @param {*} num_iid
	 * @param {*} signurl
	 * @param {*} type
	 * @return {*}
	 */
	class TList {
		constructor(options) {
			this.params = {
				appkey: options.appkey,
				sid: options.sid,
				pid: options.pid,
				num_iid: options.num_iid,
				signurl: options.signurl,
				type: options.type,
			};
		}
		// 初始化
		init() {
			this.getData();
		}
		// 获取数据
		getData() {
			let _this = this;
			let list = $(".J_MouserOnverReq");
			if (_this.params.type === "taobao") {
				list = $(".J_MouserOnverReq");
				list.each(function () {
					let that = $(this);
					that.css({ position: "relative" });
					_this.params.num_iid = $(this).find("a").attr("data-nid");
					let url =
						"https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
					dtd(url, _this.params, (res) => {
						_this.addEle(that, res);
					});
				});
			} else if (_this.params.type === "tmall") {
				list = $(".product");
				list.each(function () {
					let that = $(this);
					_this.params.num_iid = $(this).attr("data-id");
					let url =
						"https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
					dtd(url, _this.params, (res) => {
						_this.addEle(that, res);
					});
				});
			}
		}
		// 插入元素
		addEle(that, data) {
			let obj = JSON.parse(data);
			if (obj.tbk_privilege_get_response) {
				let result = obj.tbk_privilege_get_response.result;
				if (result.data.coupon_info) {
					let html =
						"<div class='jar-list-coupon'><p><a target='_blank' href=https://www.ergirl.com/jump.html?url=" +
						result.data.shorturl +
						">" +
						result.data.coupon_info +
						"</a></p></div>";
					that.append(html);
				}
			} else {
				// console.log("无");
			}
		}
	}

	/**
	 * @description: 列表头部推荐
	 * @param {*} type tb tm
	 * @param {*} data 数据源
	 * @return {*}
	 */
	class ListRec {
		constructor(options) {
			this.type = options.type;
			this.data = options.data;
		}
		// 初始化
		init() {
			this.addEle(this.data);
		}
		// 淘宝添加元素
		addEle(data) {
			let that = this;
			let list = data;
			let html = "";
			let html1 =
				'<div class="m-itemlist jar-list-rec">' +
				'<div class="grid g-clearfix">' +
				'<div class="swiper-container">' +
				'<div class="swiper-wrapper">';
			let html3 =
				'</div><div class="swiper-button-prev" style="width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)"></div>' +
				'<div class="swiper-button-next" style="width:45px;height:100px;color: #f40;margin-top:-50px;margin-right: 20px;background:rgba(0,0,0,0.4);"></div>' +
				"</div></div></div>";
			list.forEach((item) => {
				turnUrl(item.tao_id).then((res) => {
					that.recChangeUrl(res);
				});
				if (that.type === "taobao") {
					let html2 =
						'<div class="swiper-slide">' +
						'<div class="items" data-id="' +
						item.tao_id +
						'">' +
						'<div class="item J_MouserOnverReq" style="height: 365px;">' +
						'<div class="pic-box J_MouseEneterLeave J_PicBox">' +
						'<div class="pic-box-inner">' +
						'<div class="pic">' +
						'<a class="pic-link J_ClickStat J_ItemPicA" data-nid="' +
						item.tao_id +
						'" href="' +
						item.item_url +
						'" target="_blank">' +
						'<img class="J_ItemPic img" src="' +
						item.pict_url +
						'" alt="' +
						item.tao_title +
						'">' +
						"</a></div></div></div>" +
						'<div class="ctx-box J_MouseEneterLeave J_IconMoreNew">' +
						'<div class="row row-1 g-clearfix">' +
						'<div class="price g_price g_price-highlight">' +
						"<span>¥</span><strong>" +
						item.quanhou_jiage +
						"</strong>" +
						"</div>" +
						'<div class="deal-cnt">' +
						item.volume +
						"人付款</div>" +
						"</div>" +
						'<div class="row row-2 title">' +
						'<a class="J_ClickStat" href="' +
						item.item_url +
						'" target="_blank">' +
						item.tao_title +
						"</a></div></div></div></div></div>";
					html += html2;
				} else if (that.type === "tmall") {
					let html2 =
						'<div class="swiper-slide">' +
						'<div class="items product" data-id="' +
						item.tao_id +
						'" style="width:100%;height:315px;">' +
						'<div class="product-iWrap">' +
						'<div class="productImg-wrap">' +
						'<a href="' +
						item.item_url +
						'" class="productImg" target="_blank">' +
						'<img src="' +
						item.pict_url +
						'">' +
						"</a>" +
						"</div>" +
						'<p class="productPrice">' +
						'<em title="' +
						item.quanhou_jiage +
						'"><b>¥</b>' +
						item.quanhou_jiage +
						"</em>" +
						"</p>" +
						'<p class="productTitle">' +
						'<a href="' +
						item.item_url +
						'">' +
						item.tao_title +
						"</a>" +
						"</p>" +
						"</div>" +
						"</div>" +
						"</div>";
					html += html2;
				}
			});
			if (this.type === "taobao") {
				$("#mainsrp-related").append(html1 + html + html3);
			} else if (this.type === "tmall") {
				$("#J_NavAttrsForm").append(html1 + html + html3);
			}
			this.swiperInit();
		}
		// 淘宝推荐天猫推荐插入优惠券
		recChangeUrl(data) {
			let obj = data;
			let node = $('.jar-list-rec .items[data-id="' + obj.item_id + '"]');
			if (obj.coupon_info) {
				let html =
					"<div class='jar-list-coupon' style='right:22px;bottom:0;'><p><a target='_blank' href=https://www.ergirl.com/jump.html?url=" +
					obj.shorturl +
					">" +
					obj.coupon_info +
					"</a></p></div>";
				node.append(html);
			}
		}
		// 轮播图初始化
		swiperInit() {
			let num = 0;
			if (this.type === "taobao") {
				num = 4;
			} else if (this.type === "tmall") {
				num = 5;
			}
			var mySwiper = new Swiper(".swiper-container", {
				slidesPerView: num,
				slidesPerGroup: num,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
		}
	}
	// 列表初始化
	initTlist();

	// 淘宝天猫列表初始化入口
	function initTlist() {
		if (host.indexOf("taobao") > -1) {
			if (host.indexOf("item.taobao") === -1) {
				let node =
					$("#mainsrp-itemlist")[0] || $("#listsrp-itemlist")[0];
				domAddEventListener(node, () => {
					let tList = new TList({
						appkey: config.zhetaoke.appkey,
						sid: config.zhetaoke.sid,
						pid: config.zhetaoke.pid,
						num_iid: "",
						signurl: 4,
						type: "taobao",
					});
					tList.init();
				});
				let tList = new TList({
					appkey: config.zhetaoke.appkey,
					sid: config.zhetaoke.sid,
					pid: config.zhetaoke.pid,
					num_iid: "",
					signurl: 4,
					type: "taobao",
				});
				tList.init();
			}
			// 淘宝列表推荐
			listRecInit();
		} else if (host.indexOf("tmall") > -1) {
			let tmList = new TList({
				appkey: config.zhetaoke.appkey,
				sid: config.zhetaoke.sid,
				pid: config.zhetaoke.pid,
				num_iid: "",
				signurl: 4,
				type: "tmall",
			});
			tmList.init();
			// 天猫列表推荐
			tmListRecInit();
		}
	}
	function domAddEventListener(targetNode, callback) {
		if (targetNode) {
			var observer = new MutationObserver(function (mutations) {
				callback();
			});
			observer.observe(targetNode, {
				attributes: true,
				childList: true,
			});
		}
	}
	// 淘宝列表推荐初始化
	function listRecInit() {
		let q = getQueryVariable("q");
		if (q) {
			let url = "https://api.zhetaoke.com:10003/api/api_quanwang.ashx";
			let params = {
				appkey: config.zhetaoke.appkey,
				page: "1",
				page_size: "20",
				sort: "sale_num_desc",
				q: q,
				youquan: "1",
			};
			dtd(url, params, (res) => {
				let listRec = new ListRec({
					type: "taobao",
					data: JSON.parse(res).content,
				});
				listRec.init();
			});
		}
	}
	// 天猫推荐初始化
	async function tmListRecInit() {
		let q = getQueryVariable("q");
		let qq = "";
		try {
			//utf-8
			qq = decodeURI(q);
		} catch (err) {
			//gbk or 其他编码
			let pro = new Promise(function (resolve, reject) {
				urldecode(q, "gbk", function (str) {
					resolve(str);
				});
			});
			qq = await pro;
		}
		let params = {
			appkey: config.zhetaoke.appkey,
			page: "1",
			page_size: "20",
			sort: "sale_num_desc",
			q: qq,
			youquan: "1",
		};
		let url = "https://api.zhetaoke.com:10003/api/api_quanwang.ashx";
		dtd(url, params, (res) => {
			let listRec = new ListRec({
				type: "tmall",
				data: JSON.parse(res).content,
			});
			listRec.init();
		});
	}
	/**
	 * @description: 详情
	 * @param {*} appkey
	 * @param {*} sid
	 * @param {*} pid
	 * @param {*} num_iid
	 * @param {*} signurl
	 * @return {*}
	 */
	// --------------------列表功能结束--------------------
	// --------------------详情功能开始--------------------
	class Detail {
		constructor(options) {
			this.couParams = {
				appkey: options.appkey,
				sid: options.sid,
				pid: options.pid,
				num_iid: options.num_iid,
				signurl: options.signurl,
			};
			this.couParams.sign = makeSign(this.couParams);
		}
		// 获取淘宝天猫优惠券
		getCoupon() {
			let that = this;
			let url =
				"https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
			let params = this.couParams;
			dtd(url, params, (res) => {
				let data = JSON.parse(res);
				if (data.tbk_privilege_get_response) {
					that.addCoupon(res);
				}
			});
		}
		// 插入基本元素
		addBasic() {
			let html =
				'<div class="jar-detail-coupon">' +
				'<div class="jar-tab" >' +
				"<ul>" +
				'<li class="active">领券</li>' +
				"<li>相似比价</li>" +
				"<li>价格趋势</li>" +
				'</ul><span class="jar-show">隐藏</span>' +
				"</div >" +
				'<div class="jar-body">' +
				"<ul>" +
				"<li>" +
				'<div class="jar-body-coupon">' +
				'<div class="jar-body-coupon-top"></div>' +
				'<div class="clear"></div>' +
				'<div class="jar-body-coupon-right">温馨提示: <br><span><a href="https://www.ergirl.com" rel="noreferrer nofollow" target="_blank">扫码小程序查询更多优惠券</a></span><img style="width: 118px;position: absolute;top: -10px;left:180px" src="https://api.ergirl.com/images/mp-code.jpg" />' +
				"</div>" +
				"</div>" +
				"</li>" +
				"<li>" +
				'<div class="jar-like-list">' +
				"</div> " +
				"</li>" +
				"<li>" +
				'<div class="jar-history">' +
				'<div id="historyChart" style="width: 468px; height: 200px;"></div>' +
				"</div>" +
				"</li>" +
				"</ul>" +
				"</div>" +
				"</div >";
			if (host.indexOf("taobao") > -1) {
				// 插入淘宝
				$("#J_juValid").before(html);
			} else if (host.indexOf("tmall") > -1) {
				// 插入天猫
				if ($(".tb-action").length > 0) {
					$(".tb-action").before(html);
				} else if ($(".BasicContent--sku--6N_nw6c").length > 0) {
					$(".BasicContent--sku--6N_nw6c").before(html);
				}
			}
			$(".jar-detail-coupon .jar-tab li").click(function () {
				let index = $(this).index();
				$(".jar-detail-coupon .jar-tab li").removeClass("active");
				$(this).addClass("active");
				$(".jar-detail-coupon .jar-body li").hide();
				$(".jar-detail-coupon .jar-body li").eq(index).show();
			});
			$(".jar-show").click(function () {
				if ($(".jar-show").html() == "隐藏") {
					$(".jar-show").html("展开");
				} else {
					$(".jar-show").html("隐藏");
				}
				$(".jar-detail-coupon .jar-body").toggle();
			});
		}
		// 插入淘宝天猫优惠券
		addCoupon(data) {
			let obj = JSON.parse(data);
			if (obj.tbk_privilege_get_response) {
				let result = obj.tbk_privilege_get_response.result;
				let shortUrl = result.data.shorturl;
				if (result.data.coupon_info) {
					let couponInfo = result.data.coupon_info;
					let couponEndTime = result.data.coupon_end_time.substring(
						0,
						10
					);
					let couponRemainCount = result.data.coupon_remain_count;
					let html =
						'<div class="jar-body-coupon-left">' +
						couponInfo +
						"</div>" +
						'<div div class="jar-body-coupon-center">' +
						"<div>优惠券结束时间: <span>" +
						couponEndTime +
						"</span></div>" +
						"<div>优惠券剩余量: <span>" +
						couponRemainCount +
						"</span></div>" +
						"</div >" +
						'<div id="jar-qrcode" style="float:right;"></div>' +
						'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>淘宝、天猫、支付宝扫一扫</p><p>领取优惠券</p></span>' +
						'<div class="jar-button">' +
						'<a href="https://www.ergirl.com/jump.html?url=' +
						shortUrl +
						"&id=" +
						getQueryVariable("id") +
						'" target="_blank">点击领取</a></div>';
					$(".jar-body-coupon-top").append(html);
					var qrcode = new QRCode("jar-qrcode", {
						text: shortUrl,
						width: 80,
						height: 80,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H,
					});
				} else {
					let html =
						'<div class="getAgain">' +
						'<div class="again-box">' +
						'<img src="https://gw.alicdn.com/tps/TB11KWxOVXXXXXHXXXXXXXXXXXX-190-150.png" alt="">' +
						"<p>正在查询...</p>" +
						"<p>随后将返回详情页</p>" +
						"</div>" +
						"</div>" +
						'<div class="jar-body-coupon-left">当前商品暂无优惠券</div>' +
						'<div div class="jar-body-coupon-center">' +
						"<div>优惠券结束时间: <span>0</span></div>" +
						"<div>优惠券剩余量: <span>0</span></div>" +
						"</div >" +
						'<div id="jar-qrcode" style="float:right;"></div>' +
						'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>淘宝、天猫、支付宝扫一扫</p><p>查看详情</p></span>' +
						'<div class="jar-button"><a href="https://www.ergirl.com/jump.html?url=' +
						shortUrl +
						"&id=" +
						getQueryVariable("id") +
						'" target="_blank">深度查询</a></div>';
					$(".jar-body-coupon-top").before(html);
					var qrcode = new QRCode("jar-qrcode", {
						text: shortUrl,
						width: 80,
						height: 80,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H,
					});
				}
			} else {
				let html =
					'<div class="jar-body-coupon-left">当前商品暂无优惠券</div>' +
					'<div div class="jar-body-coupon-center">' +
					"<div>优惠券结束时间: <span>0</span></div>" +
					"<div>优惠券剩余量: <span>0</span></div>" +
					"</div >";
				$(".jar-body-coupon-top").before(html);
			}
		}
	}
	// 初始化详情
	if (host.indexOf("item.taobao") > -1 || host.indexOf("detail.tmall") > -1) {
		let detailParams = {
			appkey: "52b273a5972949388ce7b57b84453aa4",
			sid: "45532",
			pid: "mm_55657354_2155900321_111019450222",
			num_iid: getQueryVariable("id"),
			signurl: "4",
		};
		setTimeout(() => {
			let detail = new Detail(detailParams);
			detail.addBasic();
			detail.getCoupon();
		}, 1000);
	}
	/**
	 * @description: 相似比价
	 * @param {*} appkey
	 * @param {*} item_id
	 * @param {*} page_size
	 * @return {*}
	 */
	class Like {
		constructor(options) {
			this.likeParams = {
				appkey: options.appkey,
				item_id: options.item_id,
				page_size: 10,
			};
		}
		getLike() {
			let that = this;
			let url =
				"https://api.zhetaoke.com:10001/api/open_item_guess_like.ashx";
			let params = this.likeParams;
			dtd(url, params, (res) => {
				that.addLike(res);
			});
		}
		// 插入元素
		addLike(data) {
			let list = JSON.parse(data).content;
			list.forEach((item) => {
				let html =
					"<dl>" +
					'<dd><a href="' +
					item.item_url +
					'" target="_blank">' +
					'<div class="img">' +
					'<img src="' +
					item.pict_url +
					'" alt="">' +
					"</div>" +
					'<div class="infor" >' +
					"<div>价格: <span>" +
					item.quanhou_jiage +
					"</span></div>" +
					'<div class="jar-like-coupon">优惠券: <span>' +
					item.coupon_info_money +
					"</span></div>" +
					"<div>销量: <span>" +
					item.sellCount +
					"</span></div>" +
					"</div>" +
					'<div class="clear"></div>' +
					'<div class="title">' +
					item.tao_title +
					"</div>" +
					"</a></dd>" +
					"</dl>";
				$(".jar-like-list").append(html);
			});
		}
	}
	let like = new Like({
		appkey: "52b273a5972949388ce7b57b84453aa4",
		item_id: getQueryVariable("id"),
		page_size: 10,
	});
	like.getLike();
	/**
	 * @description: 获取历史记录
	 * @param {*}
	 * @return {*}
	 */
	class History {
		constructor(options) {
			this.hisParams = {
				appKey: "5cfe247e623ce",
				version: "v1.0.0",
				id: "38100089",
				goodsId: getQueryVariable("id"),
			};
			this.hisParams.sign = makeSign(this.hisParams);
		}
		// 获取数据
		getHistory() {
			let that = this;
			let url = "https://openapi.dataoke.com/api/goods/price-trend";
			let params = this.hisParams;
			dtd(url, params, (res) => {
				that.addHistory(res);
			});
		}
		// 插入历史数据
		addHistory(res) {
			if (res.code === 0) {
				let arr = [];
				arr = res.data.historicalPrice;
				let numArr = arr.map((item) => {
					return item.actualPrice;
				});
				let timeArr = arr.map((item) => {
					return timeFormat(item.date, 1);
				});
				let obj = {
					time: timeArr,
					historyPrice: numArr,
					maxNum: getMaxMin(numArr)[0],
					minNum: getMaxMin(numArr)[1],
				};
				eachart(obj);
			} else {
				$("#historyChart").html("暂无历史数据");
			}
		}
	}
	// 转链
	function turnUrl(id) {
		let params = {
			appkey: config.zhetaoke.appkey,
			sid: config.zhetaoke.sid,
			pid: config.zhetaoke.pid,
			signurl: 4,
			num_iid: id,
		};
		let url =
			"https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
		return new Promise(function (resolve, reject) {
			dtd(url, params, (res) => {
				let data = JSON.parse(res);
				if (data.tbk_privilege_get_response) {
					resolve(data.tbk_privilege_get_response.result.data);
				} else {
					resolve({});
				}
			});
		});
	}
	// 历史记录
	let his = new History();
	his.getHistory();
	// --------------------详情功能结束--------------------
	// 插入css
	let listCss = `.jar-list-coupon{font-family:microsoft Yahei;font-size:14px;color:#fff;position:absolute;right:0px;bottom:-11px;z-index:1;background:url(https://api.ergirl.com/coupon-bg.png) 50% no-repeat;background-size:cover;overflow:hidden;}.jar-list-coupon:before{content:"";width:150px;height:5px;background-color:#fff;opacity:0.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite;-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}.jar-list-coupon a{color:#fff;height:30px;display:block;line-height:30px;padding:0 15px;}.jar-list-coupon a:hover{color:#fff;}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px);-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}to{top:200px;transform:rotate(-36deg) translate(200px,300px);}}`;
	let swiperCss = `@font-face{font-family:swiper-icons;src:url('data:application/font-woff;charset=utf-8;base64, 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') format('woff');font-weight:400;font-style:normal}:root{--swiper-theme-color:#007aff}.swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;list-style:none;padding:0;z-index:1}.swiper-container-vertical>.swiper-wrapper{flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{transform:translate3d(0px,0,0)}.swiper-container-multirow>.swiper-wrapper{flex-wrap:wrap}.swiper-container-multirow-column>.swiper-wrapper{flex-wrap:wrap;flex-direction:column}.swiper-container-free-mode>.swiper-wrapper{transition-timing-function:ease-out;margin:0 auto}.swiper-slide{flex-shrink:0;width:100%;height:100%;position:relative;transition-property:transform}.swiper-slide-invisible-blank{visibility:hidden}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{align-items:flex-start;transition-property:transform,height}.swiper-container-3d{perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-right{background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-top{background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-css-mode>.swiper-wrapper{overflow:auto;scrollbar-width:none;-ms-overflow-style:none}.swiper-container-css-mode>.swiper-wrapper::-webkit-scrollbar{display:none}.swiper-container-css-mode>.swiper-wrapper>.swiper-slide{scroll-snap-align:start start}.swiper-container-horizontal.swiper-container-css-mode>.swiper-wrapper{scroll-snap-type:x mandatory}.swiper-container-vertical.swiper-container-css-mode>.swiper-wrapper{scroll-snap-type:y mandatory}:root{--swiper-navigation-size:44px}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:calc(var(--swiper-navigation-size)/ 44 * 27);height:var(--swiper-navigation-size);margin-top:calc(-1 * var(--swiper-navigation-size)/ 2);z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color,var(--swiper-theme-color))}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-next:after,.swiper-button-prev:after{font-family:swiper-icons;font-size:var(--swiper-navigation-size);text-transform:none!important;letter-spacing:0;text-transform:none;font-variant:initial;line-height:1}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{left:10px;right:auto}.swiper-button-prev:after,.swiper-container-rtl .swiper-button-next:after{content:'prev'}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{right:10px;left:auto}.swiper-button-next:after,.swiper-container-rtl .swiper-button-prev:after{content:'next'}.swiper-button-next.swiper-button-white,.swiper-button-prev.swiper-button-white{--swiper-navigation-color:#ffffff}.swiper-button-next.swiper-button-black,.swiper-button-prev.swiper-button-black{--swiper-navigation-color:#000000}.swiper-button-lock{display:none}.swiper-pagination{position:absolute;text-align:center;transition:.3s opacity;transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transform:scale(.33);position:relative}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{transform:scale(.33)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{transform:scale(.33)}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-bullet-active{opacity:1;background:var(--swiper-pagination-color,var(--swiper-theme-color))}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;transform:translate3d(0px,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:6px 0;display:block}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{top:50%;transform:translateY(-50%);width:8px}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{display:inline-block;transition:.2s transform,.2s top}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 4px}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{left:50%;transform:translateX(-50%);white-space:nowrap}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s left}.swiper-container-horizontal.swiper-container-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s right}.swiper-pagination-progressbar{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:var(--swiper-pagination-color,var(--swiper-theme-color));position:absolute;left:0;top:0;width:100%;height:100%;transform:scale(0);transform-origin:left top}.swiper-container-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progressbar,.swiper-container-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:4px;left:0;top:0}.swiper-container-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-container-vertical>.swiper-pagination-progressbar{width:4px;height:100%;left:0;top:0}.swiper-pagination-white{--swiper-pagination-color:#ffffff}.swiper-pagination-black{--swiper-pagination-color:#000000}.swiper-pagination-lock{display:none}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-scrollbar-lock{display:none}.swiper-zoom-container{width:100%;height:100%;display:flex;justify-content:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-slide-zoomed{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;transform-origin:50%;animation:swiper-preloader-spin 1s infinite linear;box-sizing:border-box;border:4px solid var(--swiper-preloader-color,var(--swiper-theme-color));border-radius:50%;border-top-color:transparent}.swiper-lazy-preloader-white{--swiper-preloader-color:#fff}.swiper-lazy-preloader-black{--swiper-preloader-color:#000}@keyframes swiper-preloader-spin{100%{transform:rotate(360deg)}}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-container-fade.swiper-container-free-mode .swiper-slide{transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube{overflow:visible}.swiper-container-cube .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;visibility:hidden;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube.swiper-container-rtl .swiper-slide{transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0px;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-flip{overflow:visible}.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}`;
	let detailCss = `.getAgain{width:210px;height:210px;color:#fff;display:none;background:rgba(0,0,0,.7);border-radius:5px;text-align:center;position:fixed;top:50%;z-index:999;}.getAgain .again-box{width:100%;height:100%;}.getAgain .again-box img{width:60%;margin-top:20px;}.getAgain .again-box p{font-size:16px;}.jar-detail-coupon{font-family:microsoft Yahei;width:480px;position:relative;z-index:999999;}.jar-detail-coupon .jar-tab{font-size:14px;height:32px;line-height:30px;overflow:hidden;}.jar-detail-coupon .jar-tab ul{float:left;overflow:hidden;border-right:1px solid #c5c5c5;border-left:3px solid #f84e4e;}.jar-detail-coupon .jar-tab li{color:#666;padding:0 10px;float:left;border:1px solid #c5c5c5;border-right:0;cursor:pointer;}.jar-detail-coupon .jar-tab li.active{font-weight:bold;color:#f84e4e;}.jar-detail-coupon .jar-tab .jar-show{color:#666;float:left;margin-left:10px;cursor:pointer;}.jar-detail-coupon .jar-body{height:220px;margin-top:-1px;overflow:hidden;}.jar-detail-coupon .jar-body ul{position:absolute;z-index:4;background-color:#fff;}.jar-detail-coupon .jar-body li{width:478px;height:220px;display:none;border:1px solid #c5c5c5;}.jar-detail-coupon .jar-body li:first-child{display:block;}.jar-detail-coupon .jar-body .jar-body-coupon{padding:10px;}.jar-detail-coupon .jar-body .jar-body-coupon-left{font-size:14px;height:35px;color:#fff;padding:0 25px;float:left;line-height:35px;background:url('https://api.ergirl.com/coupon-bg.png') no-repeat;background-size:100% 100%;box-sizing:border-box;position:relative;overflow:hidden;}.jar-detail-coupon .jar-body .jar-body-coupon-left:before{content:"";width:150px;height:5px;background-color:#fff;opacity:0.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite;-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}.jar-detail-coupon .jar-body .jar-body-coupon-center{font-size:14px;color:#666;margin:0 10px;float:left;}.jar-detail-coupon .jar-body .jar-body-coupon-center div{margin-bottom:10px;}.jar-detail-coupon .jar-body .jar-body-coupon-center div span{font-weight:bold;color:#f84e4e;}.jar-detail-coupon .jar-body .jar-body-coupon-right{font-size:14px;color:#666;margin-top:10px;position:relative}.jar-detail-coupon .jar-body .jar-body-coupon-right span a{font-weight:bold;color:#f84e4e!important;}.jar-detail-coupon .jar-body .jar-like-list{overflow:hidden;background: #fff;}.jar-detail-coupon .jar-body .jar-like-list dl{width:50%;float:left;}.jar-detail-coupon .jar-body .jar-like-list dd{padding:5px;}.jar-detail-coupon .jar-body .jar-like-list .img{width:100px;float:left;}.jar-detail-coupon .jar-body .jar-like-list img{max-width:100%;}.jar-detail-coupon .jar-body .jar-like-list .infor{margin-left:20px;float:left;}.jar-detail-coupon .jar-body .jar-like-list .infor div{font-size:14px;color:#666;display:block;margin-top:4px;}.jar-detail-coupon .jar-body .jar-like-list .infor div span{color:#f84e4e;}.jar-detail-coupon .jar-body .jar-like-list .infor .jar-like-coupon{color:#fff;padding:0 7px;background:url('https://api.ergirl.com/coupon-bg.png') no-repeat;background-size:100% 100%;}.jar-detail-coupon .jar-body .jar-like-list .infor .jar-like-coupon span{color:#fff;}.jar-detail-coupon .jar-body .jar-like-list .title{font-size:12px;height:35px;color:#333;overflow:hidden;}.jar-detail-coupon .jar-body .jar-like-list a:hover .title{color:red;}.jar-button{font-size:14px;width:90px;height:30px;float:left;line-height:30px;text-align:center;background-color:red;border-radius:3px;cursor:pointer;}.jar-button a{color:#fff!important;display:block;}.jar-history{font-size:16px;color:#f84e4e;text-align:center;line-height:100px;background:#fff;}.clear{clear:both;overflow:hidden;}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px);-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}to{top:200px;transform:rotate(-36deg) translate(200px,300px);}}`;
	let detailTop = `.detail-top{width:1190px}.detail-top .tab-top ul{width:505px;overflow:hidden;border-right:1px solid #b8b7bd}.detail-top .tab-top li{width:100px;float:left;line-height:30px;text-align:center;border:1px solid #b8b7bd;border-right:0;cursor:pointer}.detail-top .tab-top li.active{color:#fff;background-color:#f50}.detail-top .tab-body{height:360px}.detail-top .tab-body ul{margin:0 -10px;display:none}.detail-top .tab-body ul:first-child{display:block}.detail-top .tab-body li{height:360px;float:left;margin:0 10px;border:1px solid #ededed}.detail-top .tab-body li .pic img{width:220px;height:220px}.detail-top .tab-body li .info{font-size:18px;color:#F40;padding:0 10px;box-sizing:border-box}.detail-top .tab-body li .info .row{line-height:40px;overflow:hidden}.detail-top .tab-body li .info .price{float:left}.detail-top .tab-body li .info .price span{float:left}.detail-top .tab-body li .info .price strong{float:left}.detail-top .tab-body li .info .deal-cnt{font-size:16px;color:#888;float:right}.detail-top .tab-body li .info .title{font-size:14px;color:#3d3d3d}.detail-top .tab-body li .top-coupon{font-size:14px;color:#fff;padding:0 25px;line-height:35px;display:inline-block;background:url(https://api.ergirl.com/coupon-bg.png) no-repeat;background-size:100% 100%;position:absolute;right:11px;bottom:1px;overflow:hidden}.detail-top .tab-body li .top-coupon:before{content:"";width:150px;height:5px;background-color:#fff;opacity:.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px)}to{top:200px;transform:rotate(-36deg) translate(200px,300px)}}`;
	GMaddStyle(listCss);
	GMaddStyle(swiperCss);
	GMaddStyle(detailCss);
	GMaddStyle(detailTop);
	function GMaddStyle(cssText) {
		let a = document.createElement("style");
		a.type = "text/css";
		a.textContent = cssText;
		let doc = document.head || document.documentElement;
		doc.appendChild(a);
	}
})();
