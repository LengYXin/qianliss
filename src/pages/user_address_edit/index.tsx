import { Button, Form, Input, Textarea, View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { UserStore } from '../../store';
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
    address: {
      contactMan: "",
      contactPhone: "",
      fullValue: ""
    },
    // provinceList: ['美国', '中国', '巴西', '日本'],
    // province: '选择省份',
    // city: '选择城市',
    // region: '选择地区',
  }
  async onSubmit(e) {
    // , this.state.province, this.state.city, this.state.address, this.state.region
    // console.log(e.detail.value)
    // {isDefault:true,}
    if (e.detail.value.contactMan == "" || e.detail.value.contactMan == null) {
      return Taro.showToast({ title: "请输入收货人姓名", icon: "none" })
    }
    if (e.detail.value.contactPhone == "" || e.detail.value.contactPhone == null) {
      return Taro.showToast({ title: "请输入联系电话", icon: "none" })
    }
    if (e.detail.value.fullValue == "" || e.detail.value.fullValue == null) {
      return Taro.showToast({ title: "请输入详细地址", icon: "none" })
    }
    const key = this.$router.params.key;
    if (key != -1) {
      UserStore.onUpdateAddress({ ...UserStore.address[key], ...e.detail.value });
    } else {
      UserStore.onCreateAddress(e.detail.value);
    }
  }
  // handleChange(e) {
  //   this.setState({
  //     address: e.detail.value
  //   })
  // }
  // onChangeProvince(e) {
  //   this.setState({
  //     province: this.state.provinceList[e.detail.value]
  //   })
  // }
  // onChangeCity(e) {
  //   this.setState({
  //     city: this.state.provinceList[e.detail.value]
  //   })
  // }
  // onChangeRegion(e) {
  //   this.setState({
  //     region: this.state.provinceList[e.detail.value]
  //   })
  // }
  componentWillMount() {
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    const key = this.$router.params.key;
    let address = {
      contactMan: "",
      contactPhone: "",
      fullValue: ""
    }
    if (key != -1) {
      address = { ...UserStore.address[key] }
    }
    this.setState({ address })
  }

  componentDidHide() { }
  onSearchBar() { }
  render() {
    // console.log(this.$router.params.key);

    return (
      <View className='address'>
        <Form onSubmit={this.onSubmit}>
          <View className="box-input">
            <View className="input-name">收货人</View>
            <View className="input-one">
              <Input name="contactMan" value={this.state.address.contactMan} placeholder="收货人"></Input>
            </View>
          </View>
          <View className="box-input">
            <View className="input-name">联系电话</View>
            <View className="input-one">
              <Input type="number" name="contactPhone" value={this.state.address.contactPhone} placeholder="请输入手机号"></Input>
            </View>
          </View>
          {/* <View className="box-input">
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
          </View> */}
          <View className="box-input box-textarea">
            <View className="input-name">详细地址</View>
            <View className="input-one">
              <Textarea
                name="fullValue"
                value={this.state.address.fullValue}
                placeholder='详细地址'
              />
            </View>
          </View>
          {/* <View className="box-input">
            <View className="input-name">邮政编码</View>
            <View className="input-one">
              <Input name="code" value="" placeholder="选填"></Input>
            </View>
          </View> */}
          <Button className="box-btn" formType="submit">保存</Button>
        </Form>
      </View>
    )
  }
}

export default Index
