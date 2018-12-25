import { Image, Text, View, Navigator, Button } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import './index.less';
@observer
class Index extends Component {
    componentWillReact() {
    }
    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    render() {
        return (
            <View className="order-box">
                <View className="box-line"></View>
                <View className="box">
                    <View className="head">
                        <View className="head-left">
                            <View className="head-num">订单号：749390430</View>
                            <View className="head-time">2018.09.09 </View>
                        </View>
                        <View className="head-state">待支付</View>
                    </View>
                    <View className="content">
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                        <Image className="content-img" src="" />
                    </View>
                    <View className="commodity">
                        <View className="commodity-txt">共4件商品 待付款：</View>
                        <View className="money">￥999.00</View>
                    </View>
                    <View className="btn">
                        <Button>去支付</Button>
                    </View>
                </View>
            </View>
        )
    }
}

export default Index