// pages/cityList/cityList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0],
    //下面是字母排序
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
 citylist: [
    { "letter": "A", 
    "data": [{ "cityName": "阿坝" }, { "cityName": "阿拉善" }, { "cityName": "阿里" }, { "cityName": "安康" }, { "cityName": "安庆" }, { "cityName": "鞍山" }, { "cityName": "安顺" }, { "cityName": "安阳" }, { "cityName": "澳门" }, ]},
    { "letter": "B", 
      "data": [{ "cityName": "北京" }, { "cityName": "白银" }, { "cityName": "保定" }, { "cityName": "宝鸡" }, { "cityName": "保山" }, { "cityName": "包头" }, { "cityName": "巴中" }, { "cityName": "北海" }, { "cityName": "蚌埠" }, { "cityName": "本溪" }, { "cityName": "毕节" }, { "cityName": "滨州" }, { "cityName": "百色" }, { "cityName": "亳州" }, ] }, 
    { "letter": "C", 
      "data": [{ "cityName": "重庆" }, { "cityName": "成都" }, { "cityName": "长沙" }, { "cityName": "长春" }, { "cityName": "沧州" }, { "cityName": "常德" }, { "cityName": "昌都" }, { "cityName": "长治" }, { "cityName": "常州" }, { "cityName": "巢湖" }, { "cityName": "潮州" }, { "cityName": "承德" }, { "cityName": "郴州" }, { "cityName": "赤峰" }, { "cityName": "池州" }, { "cityName": "崇左" }, { "cityName": "楚雄" }, { "cityName": "滁州" }, { "cityName": "朝阳" }] }, 
    { "letter": "D", 
      "data": [{ "cityName": "大连" }, { "cityName": "东莞" }, { "cityName": "大理" }, { "cityName": "丹东" }, { "cityName": "大庆" }, { "cityName": "大同" }, { "cityName": "大兴安岭" }, { "cityName": "德宏" }, { "cityName": "德阳" }, { "cityName": "德州" }, { "cityName": "定西" }, { "cityName": "迪庆" }, { "cityName": "东营" }, ] }, 
  {"letter": "E","data": [{ "cityName": "鄂尔多斯" }, { "cityName": "恩施" }, { "cityName": "鄂州" }, ]},
  { "letter": "F", "data": [{ "cityName": "福州" }, { "cityName": "防城港" }, { "cityName": "佛山" }, { "cityName": "抚顺" }, { "cityName": "抚州" },  { "cityName": "阜新" },  { "cityName": "阜阳" }, ] },
      { "letter": "G", "data": [{ "cityName": "广州" }, { "cityName": "赣州" }, { "cityName": "桂林" }, { "cityName": "贵阳" }, { "cityName": "甘南" }, { "cityName": "甘孜" }, { "cityName": "广安" }, { "cityName": "广元" }, { "cityName": "果洛" }, { "cityName": "贵港" }] },      
      { "letter": "H", "data": [{ "cityName": "杭州" }, { "cityName": "哈尔滨" }, { "cityName": "合肥" }, { "cityName": "海口" }, { "cityName": "海东" }, { "cityName": "海北" }, { "cityName": "海南" }, { "cityName": "海西" }, { "cityName": "邯郸" }, { "cityName": "汉中" }, { "cityName": "鹤壁" }, { "cityName": "河池" }, { "cityName": "鹤岗" }, { "cityName": "黑河" }, { "cityName": "衡水" }, { "cityName": "衡阳" }, { "cityName": "河源" }, { "cityName": "贺州" }, { "cityName": "红河" }, { "cityName": "淮安" }, { "cityName": "淮北" }, { "cityName": "怀化" }, { "cityName": "淮南" }, { "cityName": "黄冈" }, { "cityName": "黄南" }, { "cityName": "黄山" }, { "cityName": "黄石" }, { "cityName": "惠州" }, { "cityName": "葫芦岛" }, { "cityName": "呼伦贝尔" }, { "cityName": "湖州" }, { "cityName": "菏泽" },] },  
      { "letter": "J", "data": [{ "cityName": "济南" }, { "cityName": "佳木斯" }, { "cityName": "吉安" }, { "cityName": "江门" }, { "cityName": "焦作" }, { "cityName": "嘉兴" }, { "cityName": "嘉峪关" }, { "cityName": "揭阳" }, { "cityName": "吉林" }, { "cityName": "金昌" }, { "cityName": "晋城" }, { "cityName": "景德镇" }, { "cityName": "荆门" }, { "cityName": "荆州" }, { "cityName": "金华" }, { "cityName": "济宁" }, { "cityName": "晋中" }, { "cityName": "锦州" }, { "cityName": "九江" }, { "cityName": "酒泉" }] }, 
    { "letter": "K", "data": [{ "cityName": "昆明" }, { "cityName": "开封" },]}, 
      { "letter": "L", "data": [{ "cityName": "兰州" }, { "cityName": "拉萨" }, { "cityName": "来宾" }, { "cityName": "莱芜" }, { "cityName": "廊坊" }, { "cityName": "乐山" }, { "cityName": "凉山" }, { "cityName": "连云港" }, { "cityName": "聊城" }, { "cityName": "辽阳" }, { "cityName": "辽源" }, { "cityName": "丽江" }, { "cityName": "临沧" }, { "cityName": "临汾" }, { "cityName": "临夏" }, { "cityName": "临沂" }, { "cityName": "林芝" }, { "cityName": "丽水" }, { "cityName": "六安" }, { "cityName": "六盘水" }, { "cityName": "柳州" }, { "cityName": "陇南" }, { "cityName": "龙岩" }, { "cityName": "娄底" }, { "cityName": "漯河" }, { "cityName": "洛阳" }, { "cityName": "泸州" }, { "cityName": "吕梁" }, ] }, 
    { "letter": "M", "data": [{ "cityName": "马鞍山" }, { "cityName": "茂名" }, { "cityName": "眉山" }, { "cityName": "梅州" }, { "cityName": "绵阳" }, { "cityName": "牡丹江" },] },
      { "letter": "N", "data": [{ "cityName": "南京" }, { "cityName": "南昌" }, { "cityName": "南宁" }, { "cityName": "南充" }, { "cityName": "南平" }, { "cityName": "南通" }, { "cityName": "南阳" }, { "cityName": "那曲" }, { "cityName": "内江" }, { "cityName": "宁德" }, { "cityName": "怒江" }] },  
      { "letter": "P", "data": [{ "cityName": "盘锦" }, { "cityName": "攀枝花" }, { "cityName": "平顶山" }, { "cityName": "平凉" }, { "cityName": "萍乡" }, { "cityName": "莆田" }, { "cityName": "濮阳" },] },
      { "letter": "Q", "data": [{ "cityName": "青岛" }, { "cityName": "黔东南" }, { "cityName": "黔南" }, { "cityName": "黔西南" }, { "cityName": "庆阳" }, { "cityName": "清远" }, { "cityName": "秦皇岛" }, { "cityName": "钦州" }, { "cityName": "齐齐哈尔" }, { "cityName": "泉州" }, { "cityName": "曲靖" }, { "cityName": "衢州" }] }, 
      { "letter": "R", "data": [{ "cityName": "日喀则" }, { "cityName": "日照" },] },            
      { "letter": "S", "data": [{ "cityName": "上海" }, { "cityName": "深圳" }, { "cityName": "苏州" }, { "cityName": "沈阳" }, { "cityName": "石家庄" }, { "cityName": "三门峡" }, { "cityName": "三明" }, { "cityName": "三亚" }, { "cityName": "商洛" }, { "cityName": "商丘" }, { "cityName": "上饶" }, { "cityName": "山南" }, { "cityName": "汕头" }, { "cityName": "汕尾" }, { "cityName": "韶关" }, { "cityName": "绍兴" }, { "cityName": "邵阳" }, { "cityName": "十堰" }, { "cityName": "朔州" }, { "cityName": "四平" }, { "cityName": "绥化" }, { "cityName": "遂宁" }, { "cityName": "随州" }, { "cityName": "娄底" }, { "cityName": "宿迁" }, { "cityName": "宿州" }, ] }, 
      { "letter": "T", "data": [{ "cityName": "天津" }, { "cityName": "太原" }, { "cityName": "泰安" }, { "cityName": "泰州" }, { "cityName": "唐山" }, { "cityName": "天水" }, { "cityName": "铁岭" }, { "cityName": "铜川" }, { "cityName": "通化" }, { "cityName": "通辽" }, { "cityName": "铜陵" }, { "cityName": "铜仁" }, , { "cityName": "台湾" }] }, 
      { "letter": "W", "data": [{ "cityName": "武汉" }, { "cityName": "乌鲁木齐" }, { "cityName": "无锡" }, { "cityName": "威海" }, { "cityName": "潍坊" }, { "cityName": "文山" }, { "cityName": "温州" }, { "cityName": "乌海" }, { "cityName": "芜湖" }, { "cityName": "乌兰察布" }, { "cityName": "武威" }, { "cityName": "梧州" }] }, 
      { "letter": "X", "data": [{ "cityName": "厦门" }, { "cityName": "西安" }, { "cityName": "西宁" }, { "cityName": "襄樊" }, { "cityName": "湘潭" }, { "cityName": "湘西" }, { "cityName": "咸宁" }, { "cityName": "咸阳" }, { "cityName": "孝感" }, { "cityName": "邢台" }, { "cityName": "新乡" }, { "cityName": "信阳" }, { "cityName": "新余" }, { "cityName": "忻州" }, { "cityName": "西双版纳" }, { "cityName": "宣城" }, { "cityName": "许昌" }, { "cityName": "徐州" }, { "cityName": "香港" }, { "cityName": "锡林郭勒" }, { "cityName": "兴安" }, ] }, 
      { "letter": "Y", "data": [{ "cityName": "银川" }, { "cityName": "雅安" }, { "cityName": "延安" }, { "cityName": "延边" }, { "cityName": "盐城" }, { "cityName": "阳江" }, { "cityName": "阳泉" }, { "cityName": "扬州" }, { "cityName": "烟台" }, { "cityName": "宜宾" }, { "cityName": "宜昌" }, { "cityName": "宜春" }, { "cityName": "营口" }, { "cityName": "益阳" }, { "cityName": "永州" }, { "cityName": "岳阳" }, { "cityName": "榆林" }, { "cityName": "运城" }, { "cityName": "云浮" }, { "cityName": "玉树" }, { "cityName": "玉溪" }, { "cityName": "玉林" }] }, 
      { "letter": "Z", "data": [{ "cityName": "枣阳市" }, { "cityName": "枣庄" }, { "cityName": "增城市" },        { "cityName": "扎赉特旗" }, { "cityName": "张家界" }, { "cityName": "张家口" }, { "cityName": "漳平市" }, { "cityName": "章丘市" }, { "cityName": "樟树市" }, { "cityName": "张掖" }, { "cityName": "漳州" }, { "cityName": "湛江" }, { "cityName": "肇庆" }, { "cityName": "昭通" }, ] }],
    //下面是热门城市数据，模拟数据
    newcity: ['北京', '上海', '合肥', '深圳', '南京', '杭州'],
    // citySel: '全国',
    locateCity: '',
    searchContext:'',
    inputVal:'',
    list:{ "A": [{ "id": "210300", "name": "鞍山", "fullName": "鞍山市", "initialsName": "A" }, { "id": "340800", "name": "安庆", "fullName": "安庆市", "initialsName": "A" }, { "id": "410500", "name": "安阳", "fullName": "安阳市", "initialsName": "A" }, { "id": "520400", "name": "安顺", "fullName": "安顺市", "initialsName": "A" }, { "id": "610900", "name": "安康", "fullName": "安康市", "initialsName": "A" }, { "id": "659002", "name": "阿拉尔", "fullName": "阿拉尔市", "initialsName": "A" }], "B": [{ "id": "110000", "name": "北京", "fullName": "北京市", "initialsName": "B" }, { "id": "130600", "name": "保定", "fullName": "保定市", "initialsName": "B" }, { "id": "150200", "name": "包头", "fullName": "包头市", "initialsName": "B" }, { "id": "150800", "name": "巴彦淖尔", "fullName": "巴彦淖尔市", "initialsName": "B" }, { "id": "210500", "name": "本溪", "fullName": "本溪市", "initialsName": "B" }, { "id": "220600", "name": "白山", "fullName": "白山市", "initialsName": "B" }, { "id": "220800", "name": "白城", "fullName": "白城市", "initialsName": "B" }, { "id": "340300", "name": "蚌埠", "fullName": "蚌埠市", "initialsName": "B" }, { "id": "341600", "name": "亳州", "fullName": "亳州市", "initialsName": "B" }, { "id": "371600", "name": "滨州", "fullName": "滨州市", "initialsName": "B" }, { "id": "450500", "name": "北海", "fullName": "北海市", "initialsName": "B" }, { "id": "451000", "name": "百色", "fullName": "百色市", "initialsName": "B" }, { "id": "511900", "name": "巴中", "fullName": "巴中市", "initialsName": "B" }, { "id": "520500", "name": "毕节", "fullName": "毕节市", "initialsName": "B" }, { "id": "530500", "name": "保山", "fullName": "保山市", "initialsName": "B" }, { "id": "610300", "name": "宝鸡", "fullName": "宝鸡市", "initialsName": "B" }, { "id": "620400", "name": "白银", "fullName": "白银市", "initialsName": "B" }, { "id": "659005", "name": "北屯", "fullName": "北屯市", "initialsName": "B" }], "C": [{ "id": "500000", "name": "重庆", "fullName": "重庆市", "initialsName": "C" }, { "id": "130800", "name": "承德", "fullName": "承德市", "initialsName": "C" }, { "id": "130900", "name": "沧州", "fullName": "沧州市", "initialsName": "C" }, { "id": "140400", "name": "长治", "fullName": "长治市", "initialsName": "C" }, { "id": "150400", "name": "赤峰", "fullName": "赤峰市", "initialsName": "C" }, { "id": "211300", "name": "朝阳", "fullName": "朝阳市", "initialsName": "C" }, { "id": "220100", "name": "长春", "fullName": "长春市", "initialsName": "C" }, { "id": "320400", "name": "常州", "fullName": "常州市", "initialsName": "C" }, { "id": "341100", "name": "滁州", "fullName": "滁州市", "initialsName": "C" }, { "id": "341700", "name": "池州", "fullName": "池州市", "initialsName": "C" }, { "id": "430100", "name": "长沙", "fullName": "长沙市", "initialsName": "C" }, { "id": "430700", "name": "常德", "fullName": "常德市", "initialsName": "C" }, { "id": "431000", "name": "郴州", "fullName": "郴州市", "initialsName": "C" }, { "id": "445100", "name": "潮州", "fullName": "潮州市", "initialsName": "C" }, { "id": "451400", "name": "崇左", "fullName": "崇左市", "initialsName": "C" }, { "id": "510100", "name": "成都", "fullName": "成都市", "initialsName": "C" }, { "id": "540300", "name": "昌都", "fullName": "昌都市", "initialsName": "C" }], "D": [{ "id": "139001", "name": "定州", "fullName": "定州市", "initialsName": "D" }, { "id": "140200", "name": "大同", "fullName": "大同市", "initialsName": "D" }, { "id": "210200", "name": "大连", "fullName": "大连市", "initialsName": "D" }, { "id": "210600", "name": "丹东", "fullName": "丹东市", "initialsName": "D" }, { "id": "230600", "name": "大庆", "fullName": "大庆市", "initialsName": "D" }, { "id": "370500", "name": "东营", "fullName": "东营市", "initialsName": "D" }, { "id": "371400", "name": "德州", "fullName": "德州市", "initialsName": "D" }, { "id": "441900", "name": "东莞", "fullName": "东莞市", "initialsName": "D" }, { "id": "460400", "name": "儋州", "fullName": "儋州市", "initialsName": "D" }, { "id": "469007", "name": "东方", "fullName": "东方市", "initialsName": "D" }, { "id": "510600", "name": "德阳", "fullName": "德阳市", "initialsName": "D" }, { "id": "511700", "name": "达州", "fullName": "达州市", "initialsName": "D" }, { "id": "621100", "name": "定西", "fullName": "定西市", "initialsName": "D" }], "E": [{ "id": "150600", "name": "鄂尔多斯", "fullName": "鄂尔多斯市", "initialsName": "E" }, { "id": "420700", "name": "鄂州", "fullName": "鄂州市", "initialsName": "E" }], "F": [{ "id": "210400", "name": "抚顺", "fullName": "抚顺市", "initialsName": "F" }, { "id": "210900", "name": "阜新", "fullName": "阜新市", "initialsName": "F" }, { "id": "341200", "name": "阜阳", "fullName": "阜阳市", "initialsName": "F" }, { "id": "350100", "name": "福州", "fullName": "福州市", "initialsName": "F" }, { "id": "361000", "name": "抚州", "fullName": "抚州市", "initialsName": "F" }, { "id": "440600", "name": "佛山", "fullName": "佛山市", "initialsName": "F" }, { "id": "450600", "name": "防城港", "fullName": "防城港市", "initialsName": "F" }], "G": [{ "id": "360700", "name": "赣州", "fullName": "赣州市", "initialsName": "G" }, { "id": "440100", "name": "广州", "fullName": "广州市", "initialsName": "G" }, { "id": "450300", "name": "桂林", "fullName": "桂林市", "initialsName": "G" }, { "id": "450800", "name": "贵港", "fullName": "贵港市", "initialsName": "G" }, { "id": "510800", "name": "广元", "fullName": "广元市", "initialsName": "G" }, { "id": "511600", "name": "广安", "fullName": "广安市", "initialsName": "G" }, { "id": "520100", "name": "贵阳", "fullName": "贵阳市", "initialsName": "G" }, { "id": "640400", "name": "固原", "fullName": "固原市", "initialsName": "G" }, { "id": "710200", "name": "高雄", "fullName": "高雄市", "initialsName": "G" }], "H": [{ "id": "130400", "name": "邯郸", "fullName": "邯郸市", "initialsName": "H" }, { "id": "131100", "name": "衡水", "fullName": "衡水市", "initialsName": "H" }, { "id": "150100", "name": "呼和浩特", "fullName": "呼和浩特市", "initialsName": "H" }, { "id": "150700", "name": "呼伦贝尔", "fullName": "呼伦贝尔市", "initialsName": "H" }, { "id": "211400", "name": "葫芦岛", "fullName": "葫芦岛市", "initialsName": "H" }, { "id": "230100", "name": "哈尔滨", "fullName": "哈尔滨市", "initialsName": "H" }, { "id": "230400", "name": "鹤岗", "fullName": "鹤岗市", "initialsName": "H" }, { "id": "231100", "name": "黑河", "fullName": "黑河市", "initialsName": "H" }, { "id": "320800", "name": "淮安", "fullName": "淮安市", "initialsName": "H" }, { "id": "330100", "name": "杭州", "fullName": "杭州市", "initialsName": "H" }, { "id": "330500", "name": "湖州", "fullName": "湖州市", "initialsName": "H" }, { "id": "340100", "name": "合肥", "fullName": "合肥", "initialsName": "H" }, { "id": "340400", "name": "淮南", "fullName": "淮南市", "initialsName": "H" }, { "id": "340600", "name": "淮北", "fullName": "淮北市", "initialsName": "H" }, { "id": "341000", "name": "黄山", "fullName": "黄山市", "initialsName": "H" }, { "id": "371700", "name": "菏泽", "fullName": "菏泽市", "initialsName": "H" }, { "id": "410600", "name": "鹤壁", "fullName": "鹤壁市", "initialsName": "H" }, { "id": "420200", "name": "黄石", "fullName": "黄石市", "initialsName": "H" }, { "id": "421100", "name": "黄冈", "fullName": "黄冈市", "initialsName": "H" }, { "id": "430400", "name": "衡阳", "fullName": "衡阳市", "initialsName": "H" }, { "id": "431200", "name": "怀化", "fullName": "怀化市", "initialsName": "H" }, { "id": "441300", "name": "惠州", "fullName": "惠州市", "initialsName": "H" }, { "id": "441600", "name": "河源", "fullName": "河源市", "initialsName": "H" }, { "id": "451100", "name": "贺州", "fullName": "贺州市", "initialsName": "H" }, { "id": "451200", "name": "河池", "fullName": "河池市", "initialsName": "H" }, { "id": "460100", "name": "海口", "fullName": "海口市", "initialsName": "H" }, { "id": "610700", "name": "汉中", "fullName": "汉中市", "initialsName": "H" }, { "id": "630200", "name": "海东", "fullName": "海东市", "initialsName": "H" }, { "id": "650500", "name": "哈密", "fullName": "哈密市", "initialsName": "H" }], "J": [{ "id": "140500", "name": "晋城", "fullName": "晋城市", "initialsName": "J" }, { "id": "140700", "name": "晋中", "fullName": "晋中市", "initialsName": "J" }, { "id": "210700", "name": "锦州", "fullName": "锦州市", "initialsName": "J" }, { "id": "220200", "name": "吉林", "fullName": "吉林市", "initialsName": "J" }, { "id": "230300", "name": "鸡西", "fullName": "鸡西市", "initialsName": "J" }, { "id": "230800", "name": "佳木斯", "fullName": "佳木斯市", "initialsName": "J" }, { "id": "330400", "name": "嘉兴", "fullName": "嘉兴市", "initialsName": "J" }, { "id": "330700", "name": "金华", "fullName": "金华市", "initialsName": "J" }, { "id": "360200", "name": "景德镇", "fullName": "景德镇市", "initialsName": "J" }, { "id": "360400", "name": "九江", "fullName": "九江市", "initialsName": "J" }, { "id": "360800", "name": "吉安", "fullName": "吉安市", "initialsName": "J" }, { "id": "370100", "name": "济南", "fullName": "济南市", "initialsName": "J" }, { "id": "370800", "name": "济宁", "fullName": "济宁市", "initialsName": "J" }, { "id": "410800", "name": "焦作", "fullName": "焦作市", "initialsName": "J" }, { "id": "419001", "name": "济源", "fullName": "济源市", "initialsName": "J" }, { "id": "420800", "name": "荆门", "fullName": "荆门市", "initialsName": "J" }, { "id": "421000", "name": "荆州", "fullName": "荆州市", "initialsName": "J" }, { "id": "440700", "name": "江门", "fullName": "江门市", "initialsName": "J" }, { "id": "445200", "name": "揭阳", "fullName": "揭阳市", "initialsName": "J" }, { "id": "620200", "name": "嘉峪关", "fullName": "嘉峪关市", "initialsName": "J" }, { "id": "620300", "name": "金昌", "fullName": "金昌市", "initialsName": "J" }, { "id": "620900", "name": "酒泉", "fullName": "酒泉市", "initialsName": "J" }, { "id": "710700", "name": "基隆", "fullName": "基隆市", "initialsName": "J" }, { "id": "710900", "name": "嘉义", "fullName": "嘉义市", "initialsName": "J" }], "K": [{ "id": "410200", "name": "开封", "fullName": "开封市", "initialsName": "K" }, { "id": "530100", "name": "昆明", "fullName": "昆明市", "initialsName": "K" }, { "id": "650200", "name": "克拉玛依", "fullName": "克拉玛依市", "initialsName": "K" }, { "id": "659008", "name": "可克达拉", "fullName": "可克达拉市", "initialsName": "K" }, { "id": "659009", "name": "昆玉", "fullName": "昆玉市", "initialsName": "K" }], "L": [{ "id": "131000", "name": "廊坊", "fullName": "廊坊市", "initialsName": "L" }, { "id": "141000", "name": "临汾", "fullName": "临汾市", "initialsName": "L" }, { "id": "141100", "name": "吕梁", "fullName": "吕梁市", "initialsName": "L" }, { "id": "211000", "name": "辽阳", "fullName": "辽阳市", "initialsName": "L" }, { "id": "220400", "name": "辽源", "fullName": "辽源市", "initialsName": "L" }, { "id": "320700", "name": "连云港", "fullName": "连云港市", "initialsName": "L" }, { "id": "331100", "name": "丽水", "fullName": "丽水市", "initialsName": "L" }, { "id": "341500", "name": "六安", "fullName": "六安市", "initialsName": "L" }, { "id": "350800", "name": "龙岩", "fullName": "龙岩市", "initialsName": "L" }, { "id": "371200", "name": "莱芜", "fullName": "莱芜市", "initialsName": "L" }, { "id": "371300", "name": "临沂", "fullName": "临沂市", "initialsName": "L" }, { "id": "371500", "name": "聊城", "fullName": "聊城市", "initialsName": "L" }, { "id": "410300", "name": "洛阳", "fullName": "洛阳市", "initialsName": "L" }, { "id": "411100", "name": "漯河", "fullName": "漯河市", "initialsName": "L" }, { "id": "431300", "name": "娄底", "fullName": "娄底市", "initialsName": "L" }, { "id": "450200", "name": "柳州", "fullName": "柳州市", "initialsName": "L" }, { "id": "451300", "name": "来宾", "fullName": "来宾市", "initialsName": "L" }, { "id": "510500", "name": "泸州", "fullName": "泸州市", "initialsName": "L" }, { "id": "511100", "name": "乐山", "fullName": "乐山市", "initialsName": "L" }, { "id": "520200", "name": "六盘水", "fullName": "六盘水市", "initialsName": "L" }, { "id": "530700", "name": "丽江", "fullName": "丽江市", "initialsName": "L" }, { "id": "530900", "name": "临沧", "fullName": "临沧市", "initialsName": "L" }, { "id": "540100", "name": "拉萨", "fullName": "拉萨市", "initialsName": "L" }, { "id": "540400", "name": "林芝", "fullName": "林芝市", "initialsName": "L" }, { "id": "620100", "name": "兰州", "fullName": "兰州市", "initialsName": "L" }, { "id": "621200", "name": "陇南", "fullName": "陇南市", "initialsName": "L" }], "M": [{ "id": "231000", "name": "牡丹江", "fullName": "牡丹江市", "initialsName": "M" }, { "id": "340500", "name": "马鞍山", "fullName": "马鞍山市", "initialsName": "M" }, { "id": "440900", "name": "茂名", "fullName": "茂名市", "initialsName": "M" }, { "id": "441400", "name": "梅州", "fullName": "梅州市", "initialsName": "M" }, { "id": "510700", "name": "绵阳", "fullName": "绵阳市", "initialsName": "M" }, { "id": "511400", "name": "眉山", "fullName": "眉山市", "initialsName": "M" }], "N": [{ "id": "320100", "name": "南京", "fullName": "南京市", "initialsName": "N" }, { "id": "320600", "name": "南通", "fullName": "南通市", "initialsName": "N" }, { "id": "330200", "name": "宁波", "fullName": "宁波市", "initialsName": "N" }, { "id": "350700", "name": "南平", "fullName": "南平市", "initialsName": "N" }, { "id": "350900", "name": "宁德", "fullName": "宁德市", "initialsName": "N" }, { "id": "360100", "name": "南昌", "fullName": "南昌市", "initialsName": "N" }, { "id": "411300", "name": "南阳", "fullName": "南阳市", "initialsName": "N" }, { "id": "450100", "name": "南宁", "fullName": "南宁市", "initialsName": "N" }, { "id": "511000", "name": "内江", "fullName": "内江市", "initialsName": "N" }, { "id": "511300", "name": "南充", "fullName": "南充市", "initialsName": "N" }], "P": [{ "id": "211100", "name": "盘锦", "fullName": "盘锦市", "initialsName": "P" }, { "id": "350300", "name": "莆田", "fullName": "莆田市", "initialsName": "P" }, { "id": "360300", "name": "萍乡", "fullName": "萍乡市", "initialsName": "P" }, { "id": "410400", "name": "平顶山", "fullName": "平顶山市", "initialsName": "P" }, { "id": "410900", "name": "濮阳", "fullName": "濮阳市", "initialsName": "P" }, { "id": "510400", "name": "攀枝花", "fullName": "攀枝花市", "initialsName": "P" }, { "id": "530800", "name": "普洱", "fullName": "普洱市", "initialsName": "P" }, { "id": "620800", "name": "平凉", "fullName": "平凉市", "initialsName": "P" }], "Q": [{ "id": "130300", "name": "秦皇岛", "fullName": "秦皇岛市", "initialsName": "Q" }, { "id": "230200", "name": "齐齐哈尔", "fullName": "齐齐哈尔市", "initialsName": "Q" }, { "id": "230900", "name": "七台河", "fullName": "七台河市", "initialsName": "Q" }, { "id": "330800", "name": "衢州", "fullName": "衢州市", "initialsName": "Q" }, { "id": "350500", "name": "泉州", "fullName": "泉州市", "initialsName": "Q" }, { "id": "370200", "name": "青岛", "fullName": "青岛市", "initialsName": "Q" }, { "id": "429005", "name": "潜江", "fullName": "潜江市", "initialsName": "Q" }, { "id": "441800", "name": "清远", "fullName": "清远市", "initialsName": "Q" }, { "id": "450700", "name": "钦州", "fullName": "钦州市", "initialsName": "Q" }, { "id": "469002", "name": "琼海", "fullName": "琼海市", "initialsName": "Q" }, { "id": "530300", "name": "曲靖", "fullName": "曲靖市", "initialsName": "Q" }, { "id": "621000", "name": "庆阳", "fullName": "庆阳市", "initialsName": "Q" }], "R": [{ "id": "371100", "name": "日照", "fullName": "日照市", "initialsName": "R" }, { "id": "540200", "name": "日喀则", "fullName": "日喀则市", "initialsName": "R" }], "S": [{ "id": "310000", "name": "上海", "fullName": "上海市", "initialsName": "S" }, { "id": "130100", "name": "石家庄", "fullName": "石家庄市", "initialsName": "S" }, { "id": "140600", "name": "朔州", "fullName": "朔州市", "initialsName": "S" }, { "id": "210100", "name": "沈阳", "fullName": "沈阳市", "initialsName": "S" }, { "id": "220300", "name": "四平", "fullName": "四平市", "initialsName": "S" }, { "id": "220700", "name": "松原", "fullName": "松原市", "initialsName": "S" }, { "id": "230500", "name": "双鸭山", "fullName": "双鸭山市", "initialsName": "S" }, { "id": "231200", "name": "绥化", "fullName": "绥化市", "initialsName": "S" }, { "id": "320500", "name": "苏州", "fullName": "苏州市", "initialsName": "S" }, { "id": "321300", "name": "宿迁", "fullName": "宿迁市", "initialsName": "S" }, { "id": "330600", "name": "绍兴", "fullName": "绍兴市", "initialsName": "S" }, { "id": "341300", "name": "宿州", "fullName": "宿州市", "initialsName": "S" }, { "id": "350400", "name": "三明", "fullName": "三明市", "initialsName": "S" }, { "id": "361100", "name": "上饶", "fullName": "上饶市", "initialsName": "S" }, { "id": "411200", "name": "三门峡", "fullName": "三门峡市", "initialsName": "S" }, { "id": "411400", "name": "商丘", "fullName": "商丘市", "initialsName": "S" }, { "id": "420300", "name": "十堰", "fullName": "十堰市", "initialsName": "S" }, { "id": "421300", "name": "随州", "fullName": "随州市", "initialsName": "S" }, { "id": "430500", "name": "邵阳", "fullName": "邵阳市", "initialsName": "S" }, { "id": "440200", "name": "韶关", "fullName": "韶关市", "initialsName": "S" }, { "id": "440300", "name": "深圳", "fullName": "深圳市", "initialsName": "S" }, { "id": "440500", "name": "汕头", "fullName": "汕头市", "initialsName": "S" }, { "id": "441500", "name": "汕尾", "fullName": "汕尾市", "initialsName": "S" }, { "id": "460200", "name": "三亚", "fullName": "三亚市", "initialsName": "S" }, { "id": "460300", "name": "三沙", "fullName": "三沙市", "initialsName": "S" }, { "id": "510900", "name": "遂宁", "fullName": "遂宁市", "initialsName": "S" }, { "id": "540500", "name": "山南", "fullName": "山南市", "initialsName": "S" }, { "id": "611000", "name": "商洛", "fullName": "商洛市", "initialsName": "S" }, { "id": "640200", "name": "石嘴山", "fullName": "石嘴山市", "initialsName": "S" }, { "id": "659001", "name": "石河子", "fullName": "石河子市", "initialsName": "S" }, { "id": "659007", "name": "双河", "fullName": "双河市", "initialsName": "S" }], "T": [{ "id": "120000", "name": "天津", "fullName": "天津市", "initialsName": "T" }, { "id": "130200", "name": "唐山", "fullName": "唐山市", "initialsName": "T" }, { "id": "140100", "name": "太原", "fullName": "太原市", "initialsName": "T" }, { "id": "150500", "name": "通辽", "fullName": "通辽市", "initialsName": "T" }, { "id": "211200", "name": "铁岭", "fullName": "铁岭市", "initialsName": "T" }, { "id": "220500", "name": "通化", "fullName": "通化市", "initialsName": "T" }, { "id": "321200", "name": "泰州", "fullName": "泰州市", "initialsName": "T" }, { "id": "331000", "name": "台州", "fullName": "台州市", "initialsName": "T" }, { "id": "340700", "name": "铜陵", "fullName": "铜陵市", "initialsName": "T" }, { "id": "370900", "name": "泰安", "fullName": "泰安市", "initialsName": "T" }, { "id": "429006", "name": "天门", "fullName": "天门市", "initialsName": "T" }, { "id": "520600", "name": "铜仁", "fullName": "铜仁市", "initialsName": "T" }, { "id": "610200", "name": "铜川", "fullName": "铜川市", "initialsName": "T" }, { "id": "620500", "name": "天水", "fullName": "天水市", "initialsName": "T" }, { "id": "650400", "name": "吐鲁番", "fullName": "吐鲁番市", "initialsName": "T" }, { "id": "659003", "name": "图木舒克", "fullName": "图木舒克市", "initialsName": "T" }, { "id": "659006", "name": "铁门关", "fullName": "铁门关市", "initialsName": "T" }, { "id": "710100", "name": "台北", "fullName": "台北市", "initialsName": "T" }, { "id": "710300", "name": "台南", "fullName": "台南市", "initialsName": "T" }, { "id": "710400", "name": "台中", "fullName": "台中市", "initialsName": "T" }, { "id": "711400", "name": "桃园", "fullName": "桃园市", "initialsName": "T" }], "W": [{ "id": "150300", "name": "乌海", "fullName": "乌海市", "initialsName": "W" }, { "id": "150900", "name": "乌兰察布", "fullName": "乌兰察布市", "initialsName": "W" }, { "id": "320200", "name": "无锡", "fullName": "无锡市", "initialsName": "W" }, { "id": "330300", "name": "温州", "fullName": "温州市", "initialsName": "W" }, { "id": "340200", "name": "芜湖", "fullName": "芜湖市", "initialsName": "W" }, { "id": "370700", "name": "潍坊", "fullName": "潍坊市", "initialsName": "W" }, { "id": "371000", "name": "威海", "fullName": "威海市", "initialsName": "W" }, { "id": "420100", "name": "武汉", "fullName": "武汉市", "initialsName": "W" }, { "id": "450400", "name": "梧州", "fullName": "梧州市", "initialsName": "W" }, { "id": "469001", "name": "五指山", "fullName": "五指山市", "initialsName": "W" }, { "id": "469005", "name": "文昌", "fullName": "文昌市", "initialsName": "W" }, { "id": "469006", "name": "万宁", "fullName": "万宁市", "initialsName": "W" }, { "id": "610500", "name": "渭南", "fullName": "渭南市", "initialsName": "W" }, { "id": "620600", "name": "武威", "fullName": "武威市", "initialsName": "W" }, { "id": "640300", "name": "吴忠", "fullName": "吴忠市", "initialsName": "W" }, { "id": "650100", "name": "乌鲁木齐", "fullName": "乌鲁木齐市", "initialsName": "W" }, { "id": "659004", "name": "五家渠", "fullName": "五家渠市", "initialsName": "W" }], "X": [{ "id": "130500", "name": "邢台", "fullName": "邢台市", "initialsName": "X" }, { "id": "139002", "name": "辛集", "fullName": "辛集市", "initialsName": "X" }, { "id": "140900", "name": "忻州", "fullName": "忻州市", "initialsName": "X" }, { "id": "320300", "name": "徐州", "fullName": "徐州市", "initialsName": "X" }, { "id": "341800", "name": "宣城", "fullName": "宣城市", "initialsName": "X" }, { "id": "350200", "name": "厦门", "fullName": "厦门市", "initialsName": "X" }, { "id": "360500", "name": "新余", "fullName": "新余市", "initialsName": "X" }, { "id": "410700", "name": "新乡", "fullName": "新乡市", "initialsName": "X" }, { "id": "411000", "name": "许昌", "fullName": "许昌市", "initialsName": "X" }, { "id": "411500", "name": "信阳", "fullName": "信阳市", "initialsName": "X" }, { "id": "420600", "name": "襄阳", "fullName": "襄阳市", "initialsName": "X" }, { "id": "420900", "name": "孝感", "fullName": "孝感市", "initialsName": "X" }, { "id": "421200", "name": "咸宁", "fullName": "咸宁市", "initialsName": "X" }, { "id": "429004", "name": "仙桃", "fullName": "仙桃市", "initialsName": "X" }, { "id": "430300", "name": "湘潭", "fullName": "湘潭市", "initialsName": "X" }, { "id": "610100", "name": "西安", "fullName": "西安市", "initialsName": "X" }, { "id": "610400", "name": "咸阳", "fullName": "咸阳市", "initialsName": "X" }, { "id": "630100", "name": "西宁", "fullName": "西宁市", "initialsName": "X" }, { "id": "710800", "name": "新竹", "fullName": "新竹市", "initialsName": "X" }, { "id": "711100", "name": "新北", "fullName": "新北市", "initialsName": "X" }], "Y": [{ "id": "140300", "name": "阳泉", "fullName": "阳泉市", "initialsName": "Y" }, { "id": "140800", "name": "运城", "fullName": "运城市", "initialsName": "Y" }, { "id": "210800", "name": "营口", "fullName": "营口市", "initialsName": "Y" }, { "id": "230700", "name": "伊春", "fullName": "伊春市", "initialsName": "Y" }, { "id": "320900", "name": "盐城", "fullName": "盐城市", "initialsName": "Y" }, { "id": "321000", "name": "扬州", "fullName": "扬州市", "initialsName": "Y" }, { "id": "360600", "name": "鹰潭", "fullName": "鹰潭市", "initialsName": "Y" }, { "id": "360900", "name": "宜春", "fullName": "宜春市", "initialsName": "Y" }, { "id": "370600", "name": "烟台", "fullName": "烟台市", "initialsName": "Y" }, { "id": "420500", "name": "宜昌", "fullName": "宜昌市", "initialsName": "Y" }, { "id": "430600", "name": "岳阳", "fullName": "岳阳市", "initialsName": "Y" }, { "id": "430900", "name": "益阳", "fullName": "益阳市", "initialsName": "Y" }, { "id": "431100", "name": "永州", "fullName": "永州市", "initialsName": "Y" }, { "id": "441700", "name": "阳江", "fullName": "阳江市", "initialsName": "Y" }, { "id": "445300", "name": "云浮", "fullName": "云浮市", "initialsName": "Y" }, { "id": "450900", "name": "玉林", "fullName": "玉林市", "initialsName": "Y" }, { "id": "511500", "name": "宜宾", "fullName": "宜宾市", "initialsName": "Y" }, { "id": "511800", "name": "雅安", "fullName": "雅安市", "initialsName": "Y" }, { "id": "530400", "name": "玉溪", "fullName": "玉溪市", "initialsName": "Y" }, { "id": "610600", "name": "延安", "fullName": "延安市", "initialsName": "Y" }, { "id": "610800", "name": "榆林", "fullName": "榆林市", "initialsName": "Y" }, { "id": "640100", "name": "银川", "fullName": "银川市", "initialsName": "Y" }], "Z": [{ "id": "130700", "name": "张家口", "fullName": "张家口市", "initialsName": "Z" }, { "id": "321100", "name": "镇江", "fullName": "镇江市", "initialsName": "Z" }, { "id": "330900", "name": "舟山", "fullName": "舟山市", "initialsName": "Z" }, { "id": "350600", "name": "漳州", "fullName": "漳州市", "initialsName": "Z" }, { "id": "370300", "name": "淄博", "fullName": "淄博市", "initialsName": "Z" }, { "id": "370400", "name": "枣庄", "fullName": "枣庄市", "initialsName": "Z" }, { "id": "410100", "name": "郑州", "fullName": "郑州市", "initialsName": "Z" }, { "id": "411600", "name": "周口", "fullName": "周口市", "initialsName": "Z" }, { "id": "411700", "name": "驻马店", "fullName": "驻马店市", "initialsName": "Z" }, { "id": "430200", "name": "株洲", "fullName": "株洲市", "initialsName": "Z" }, { "id": "430800", "name": "张家界", "fullName": "张家界市", "initialsName": "Z" }, { "id": "440400", "name": "珠海", "fullName": "珠海市", "initialsName": "Z" }, { "id": "440800", "name": "湛江", "fullName": "湛江市", "initialsName": "Z" }, { "id": "441200", "name": "肇庆", "fullName": "肇庆市", "initialsName": "Z" }, { "id": "442000", "name": "中山", "fullName": "中山市", "initialsName": "Z" }, { "id": "510300", "name": "自贡", "fullName": "自贡市", "initialsName": "Z" }, { "id": "512000", "name": "资阳", "fullName": "资阳市", "initialsName": "Z" }, { "id": "520300", "name": "遵义", "fullName": "遵义市", "initialsName": "Z" }, { "id": "530600", "name": "昭通", "fullName": "昭通市", "initialsName": "Z" }, { "id": "620700", "name": "张掖", "fullName": "张掖市", "initialsName": "Z" }, { "id": "640500", "name": "中卫", "fullName": "中卫市", "initialsName": "Z" }] },
    searchResult:false,

  },
//  < view style = 'background:#ffffff' class= "searchName" wx:for= "{{selectData}}" wx: key = "key" data - fullname="{{item}}" bindtap = 'selectCity' > {{ item }}


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const win = wx.getSystemInfoSync();
    console.log(win);
    this.setData({
      winHeight: win.windowHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPlace()//定位
   
  },
  // 系统回车搜索
  searchHandle: function (e) {
    var that = this;
    if (that.data.selectData != ''){
      that.setData({
        searchResult:true,
        inputShowed: true
      })
    }else{
      wx.showToast({
        title: '请输入中文汉字',
        icon:'none'
      })
    }
  },
  // 文本输入 事件
  getInputValue: function (e) {
    let cityData = this.data.list;
    let selectData = [];
    if (e.detail.value == '') {
      this.setData({
        inputVal: e.detail.value,
        selectData
      });
    } else {
      for (let i in cityData) {
        for (let j in cityData[i]) {
         
          if (cityData[i][j].fullName.includes(e.detail.value)) {
            // console.log(cityData[i][j])
            selectData.push(cityData[i][j].fullName)
          }
        }
      }
      // console.log(selectData);
      this.setData({
        selectData,
        inputVal: e.detail.value,
      });
    }
  },
  // 搜索结果点击
  searchCity:function(e){
    // console.log(e)
    this.setData({
      city: e.currentTarget.dataset.val
    })
    wx.navigateBack({
      
    })
  },
  // 左侧点击搜索
  toSearch: function () {
    var that = this;
    if (that.data.selectData != '') {
      that.setData({
        searchResult: true,
        inputShowed: true
      })
    } else {
      wx.showToast({
        title: '请输入中文汉字',
        icon: 'none'
      })
    }
  },
  // 取消按钮
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  // 定位
  getPlace:function(){
    var that = this;
    wx.getStorage({
      key: 'cityName',
      success: function (res) {
        console.log(res);
        that.setData({
          city: res.data
        })
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //点击城市列表
  cityTap(e) {
    console.log(e)
    const val = e.currentTarget.dataset.val || '',
      types = e.currentTarget.dataset.types || '',
      Index = e.currentTarget.dataset.index || '',
      that = this;
    let city = this.data.citySel;
    switch (types) {
      case 'locate':
        //定位内容
        city = this.data.locateCity;
        break;
      case 'national':
        //全国
        city = '全国';
        break;
      case 'new':
        //热门城市
        city = val;
        break;
      case 'list':
        //城市列表
        city = val.cityName;
        break;
    }
    if (city) {
      wx.setStorage({
        key: 'city',
        data: city
      })
      //点击后给父组件可以通过bindcitytap事件，获取到cityname的值，这是子组件给父组件传值和触发事件的方法
      this.triggerEvent('citytap', { cityname: city });
    } else {
      console.log('还没有');
      
    }
    this.setData({
      city: city
    })
    wx.navigateBack({//返回
      
    })
  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
    console.log("..............." + this.data.cityListId);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    console.log(this.data.city)
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      dingwei: this.data.city
    })
    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。

    //最后就是返回上一个页面。
    // wx.navigateBack({
    //   delta: 1  // 返回上一级页面。
    // })
  },
 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})