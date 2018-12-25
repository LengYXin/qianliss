import { View, Input, Picker, Form, Button, Textarea } from '@tarojs/components';
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
  state = {
    address: '',
    provinceList: ['美国', '中国', '巴西', '日本'],
    province: '选择省份',
    city: '选择城市',
    region: '选择地区',
  }
  async onSubmit(e) {
    console.log(e.detail.value, this.state.province, this.state.city, this.state.address, this.state.region)
  }
  handleChange(e) {
    this.setState({
      address: e.detail.value
    })
  }
  onChangeProvince(e) {
    this.setState({
      province: this.state.provinceList[e.detail.value]
    })
  }
  onChangeCity(e) {
    this.setState({
      city: this.state.provinceList[e.detail.value]
    })
  }
  onChangeRegion(e) {
    this.setState({
      region: this.state.provinceList[e.detail.value]
    })
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
        <Form onSubmit={this.onSubmit}>
          <View className="box-input">
            <View className="input-name">收货人</View>
            <View className="input-one">
              <Input name="name" value="" placeholder="收货人"></Input>
            </View>
          </View>
          <View className="box-input">
            <View className="input-name">联系电话</View>
            <View className="input-one">
              <Input name="phone" value="" placeholder="请输入手机号"></Input>
            </View>
          </View>
          <View className="box-input">
            <View className="input-name">选择地区</View>
            <View className="input-one">
              <View className="input-add">
                <Picker mode='selector' range={this.state.provinceList} onChange={this.onChangeProvince}>
                  <View className='picker add add-province'>
                    {this.state.province}
                  </View>
                </Picker>
                <Picker mode='selector' range={this.state.provinceList} onChange={this.onChangeCity}>
                  <View className='picker add add-city'>
                    {this.state.city}
                  </View>
                </Picker>
                <Picker mode='selector' range={this.state.provinceList} onChange={this.onChangeRegion}>
                  <View className='picker add add-region'>
                    {this.state.region}
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="box-input box-textarea">
            <View className="input-name">详细地址</View>
            <View className="input-one">
              <Textarea
                count={false}
                value={this.state.address}
                onInput={this.handleChange.bind(this)}
                maxLength={100}
                placeholder='你的问题是...'
              />
            </View>
          </View>
          <View className="box-input">
            <View className="input-name">邮政编码</View>
            <View className="input-one">
              <Input name="code" value="" placeholder="选填"></Input>
            </View>
          </View>
          <Button className="box-btn" formType="submit">保存</Button>
        </Form>
      </View>
    )
  }
}

export default Index
