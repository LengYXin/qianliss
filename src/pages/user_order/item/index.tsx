import { Button, Image, View, Navigator } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { OrderStore } from '../../../store';
import './index.less';
@observer
class Index extends Component<{ data: any }, any> {
    static defaultProps = {
        data: {
            amount: 0,
            skus: []
        }
    }
    componentWillReact() {
    }
    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    onPayByWeixinBegin() {
        OrderStore.onPayByWeixinBegin(this.props.data.id)
    }
    onReceiveSaleBill() {
        OrderStore.onReceiveSaleBill(this.props.data.id)
    }
    onShow(data) {
        Taro.showModal({
            title: data.text,
            content: `单价：￥${data.amount.toFixed(2)} 购买数量：${data.count}`,
            showCancel:false
        })
    }
    status = {
        190100: '待支付',
        190101: '待发货',
        190102: '待收货',
        190103: '已完成'
    }
    render() {
        const data = { ...this.props.data };
        const skus = [...data.skus];
        const amount = data.amount.toFixed(2);
        const status = this.status[data.status]
        return (
            <View className="order-box">
                <View className="box-line"></View>
                <View className="box">
                    <View className="head">
                        <View className="head-left">
                            <View className="head-num">订单号：{data.no}</View>
                            <View className="head-time">{data.createdTime}</View>
                        </View>
                        <View className="head-state">{status}</View>
                    </View>
                    <View className="content">
                        {skus.map((x, i) => {
                            return <Image onClick={this.onShow.bind(this, x)} className="content-img" key={x.id} src={x.thumbUrl} />
                            // return <Navigator className="content-img"  url={'/pages/details/index?id=' + x.id} key={x.id}>
                            //     <Image key={i} src={x.thumbUrl} />
                            // </Navigator>
                        })}
                    </View>
                    <View className="commodity">
                        <View className="commodity-txt">共{skus.length}件商品 {status}：</View>
                        <View className="money">￥{amount}</View>
                    </View>
                    {data.status == 190100 ? <View className="btn">
                        <Button onClick={this.onPayByWeixinBegin.bind(this)}>去支付</Button>
                    </View> : <View />}
                    {data.status == 190102 ? <View className="btn">
                        <Button onClick={this.onReceiveSaleBill.bind(this)}>确认收货</Button>
                    </View> : <View />}
                </View>
            </View>
        )
    }
}

export default Index