import { View,Input } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '千里首铺',
    // 下拉刷新
    // enablePullDownRefresh: true,
    // backgroundTextStyle: "dark"
  }
  componentWillMount() {
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onSearchBar() { }
  render() {
    return (
      <View className='address'>
        <View className="box-input">
          <View className="input-name">收货人</View>
          <View className="input-one">
            <Input name="pwd2" value="" placeholder="收货人"></Input>
          </View>
        </View>
        <View className="box-input">
          <View className="input-name">联系电话</View>
          <View className="input-one">
            <Input name="pwd2" value="" placeholder="请输入手机号"></Input>
          </View>
        </View>
        <View className="box-input">
          <View className="input-name">选择地区</View>
          <View className="input-one">
            {/* <Input name="pwd2" value="" placeholder="收货人"></Input> */}
            <View className="input-add">
               <View className="add add-province">选择省份</View>
               <View className="add add-city">选择城市</View>
               <View className="add add-region">选择地区</View>
            </View>
          </View>
        </View>
        <View className="box-input">
          <View className="input-name">邮政编码</View>
          <View className="input-one">
            <Input name="pwd2" value="" placeholder="选填"></Input>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
