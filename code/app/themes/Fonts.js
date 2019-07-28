// @flow

const type = {
  base: 'HelveticaNeue',
  bold: 'HelveticaNeue-Bold',
  emphasis: 'HelveticaNeue-Italic'
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 14,
  small2: 13,
  small: 12,
  tiny1: 11,
  tiny: 8.5
};

const Size = {
    navSize:18,//顶部导航栏栏目名称,
    titleSize:16,//主要用于正文标题，主按妞文字
    listSize:14,//区域标题性文字，列表名称
    searchSize:12,//正文及内容型文字，搜索条件文字
    screenSize:11,//筛选框文字
    otherSize:10//说明文，日期，提示文，辅助性文字
}



const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  },
  rowText: {
    fontFamily: type.base,
    fontSize: size.small2
  }
};

export default {
  type,
  size,
  style,
  Size
}

