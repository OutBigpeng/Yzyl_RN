/**
 * 课程报名  成功页面
 * Created by coatu on 2017/8/24.
 */
import React, {Component} from 'react';

import {CommonSuccessView} from '../../component/CommonAssembly';

export default class SignUpStatusView extends Component {
    render() {
        return (
            <CommonSuccessView
                title='您的报名已提交!'
                content='我们的工作人员会尽快联系您!'
                BGColor={'white'}
                logo={require('../../imgs/other/success.png')}
            />
        )
    }
}