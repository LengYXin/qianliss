import { View } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { AtActivityIndicator } from 'taro-ui';
import './index.less';
export default class extends Component<{ visible: boolean }, any> {
    render() {
        const { visible } = this.props;
        return (
            <View className="loading">
                {visible ? <AtActivityIndicator content='loading...'></AtActivityIndicator> : null}
            </View>
        )
    }
}

