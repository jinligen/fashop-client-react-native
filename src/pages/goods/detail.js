// 普通商品列表点进商品详情时，如果为多规格，则默认展示第一个规格，规格中如果有参与拼团的，则切换至该规格时刷新出拼团详情
// 从拼团商品列表点进商品详情时，如果为多规格，则默认展示拼团规格中的第一个

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { connect } from "react-redux";
import { ThemeStyle, windowWidth, PublicStyles } from '../../utils/style';
import { Carousel } from 'antd-mobile-rn'
import {
    Goods,
    Separator,
    BodyImage,
    Video,
    BodyText
} from '../../components/body'
import SpecList from '../../components/goods/specList'
import SpecModal from "../../components/goods/specModal";
import Badge from "@react-native-component/react-native-smart-badge";
import ActionSheet from "react-native-actionsheet";
import { wechatShare } from '../../utils/wechat'
// import WebHtmlView from "../../components/public/webHtmlView";

// const htmlContent = `
//     <div class="cap-richtext" color="#f9f9f9" content="" fullscreen="0" type="rich_text" __zent-design-uuid__="3d7cd6d3-ae9b-4a84-8af6-867c029f32a3" style="background-color: #ffffff;">
//     <p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p><p>还可以在这里加入表格了</p><table><tbody><tr><td width="93" valign="top" style="word-break: break-all;">中奖客户</td><td width="93" valign="top" style="word-break: break-all;">发放奖品</td><td width="93" valign="top" style="word-break: break-all;">备注</td></tr><tr><td width="93" valign="top" style="word-break: break-all;">猪猪</td><td width="93" valign="top" style="word-break: break-all;">内测码</td><td width="93" valign="top" style="word-break: break-all;"><em><span style="color: rgb(255, 0, 0);">已经发放</span></em></td></tr><tr><td width="93" valign="top" style="word-break: break-all;">大麦</td><td width="93" valign="top" style="word-break: break-all;">积分</td><td width="93" valign="top" style="word-break: break-all;"><a href="javascript: void(0);" target="_blank">领取地址</a></td></tr></tbody></table><p style="text-align: left;"><span style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p>
//     <p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p><p>还可以在这里加入表格了</p><table><tbody><tr><td width="93" valign="top" style="word-break: break-all;">中奖客户</td><td width="93" valign="top" style="word-break: break-all;">发放奖品</td><td width="93" valign="top" style="word-break: break-all;">备注</td></tr><tr><td width="93" valign="top" style="word-break: break-all;">猪猪</td><td width="93" valign="top" style="word-break: break-all;">内测码</td><td width="93" valign="top" style="word-break: break-all;"><em><span style="color: rgb(255, 0, 0);">已经发放</span></em></td></tr><tr><td width="93" valign="top" style="word-break: break-all;">大麦</td><td width="93" valign="top" style="word-break: break-all;">积分</td><td width="93" valign="top" style="word-break: break-all;"><a href="javascript: void(0);" target="_blank">领取地址</a></td></tr></tbody></table><p style="text-align: left;"><span style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p>
//     </div>
// `

@connect(({ goods, user, goodsCollect }) => ({
    data: goods.info.result.info,
    is_collect: goodsCollect.state.result.state,
    login: user.login
}))
export default class GoodsDetail extends Component {
    state = {
        specVisible: false,
        if_cart: -1,
    }

    componentDidMount() {
        const {
            navigation,
            dispatch,
            login
        } = this.props
        const { id } = navigation.state.params
        dispatch({
            type: 'goods/info',
            payload: { id }
        })
        if(login){
            dispatch({
                type: 'goodsCollect/state',
                payload: { goods_id: id }
            })
        }
    }

    render() {
        const { specVisible, if_cart } = this.state;
        const { navigation, dispatch, login, data } = this.props;
        const { id } = navigation.state.params
        return data ? <View style={PublicStyles.ViewMax}>
            <ScrollView>
                {
                    this.carousel(data.images)
                }
                {
                    this.titleView(data)
                }
                {
                    this.detail(data)
                }
            </ScrollView>
            {
                this.botView()
            }
            <SpecModal
                visible={specVisible}
                hide={() => {
                    this.setState({
                        specVisible: false
                    })
                }}
                ref={e => this.SpecModal = e}
            >
                <SpecList
                    spec_list={data.spec_list ? data.spec_list : []}
                    skus={data.skus ? data.skus : []}
                    if_cart={if_cart}
                    navigation={navigation}
                    dispatch={dispatch}
                    title={data.title}
                    login={login}
                    closeModal={()=>{
                        this.setState({
                            specVisible: false
                        })
                    }}
                />
            </SpecModal>
            <ActionSheet
                ref={o => this.ShareActionSheet = o}
                title={'分享'}
                options={['好友', '朋友圈', '取消']}
                cancelButtonIndex={2}
                onPress={(index) => {
                    if (index !== 2) {
                        if (index === 0) {
                            wechatShare({
                                type: 'session',
                                params: {
                                    type: 'mini',
                                    userName: 'gh_cbed9edbbc7d',  // 小程序的原始ID，不是APPID
                                    miniProgramType: 1,  // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                                    path: `/pages/goods/detail/index?id=${id}`, // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                                    hdImageData: data.img,
                                    title: data.title,
                                    description: `description`,
                                    thumbImage: 'https://i.ibb.co/m6Z424d/favicon.png',
                                    webpageUrl: ``
                                }
                            })
                        }else {
                            console.log('分享到朋友圈');
                        }
                    }
                }}
            />
        </View> : null
    }

    closeModal = () => {
        this.setState({ specVisible: false });
    }

    carousel(data) {
        const { navigation } = this.props
        let newImages = Array.isArray(data) && data.length > 0 ? data.map(item => {
            return { source: { uri: item } }
        }) : []
        return (
            <Carousel
                autoplay={Array.isArray(data) && data.length > 1}
                infinite={Array.isArray(data) && data.length > 1}
                dotActiveStyle={styles.dotActive}
                dotStyle={styles.dot}
            >
                {
                    Array.isArray(data) && data.map((item, index) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.carouselImg}
                            onPress={() => {
                                navigation.navigate('PhotoGallery', {
                                    images: newImages,
                                    index
                                })
                            }}
                            key={index}
                        >
                            <Image
                                source={{
                                    uri: item
                                }}
                                style={styles.carouselImg}
                            />
                        </TouchableOpacity>
                    ))
                }
            </Carousel>
        )
    }

    titleView(data) {
        return (
            <View style={styles.titleWarp}>
                <View style={styles.titleTop}>
                    <Text style={[styles.title, PublicStyles.boldTitle]}>{data.title}</Text>
                    <View style={PublicStyles.rowBetweenCenter}>
                        <Text style={[PublicStyles.boldTitle,styles.price]}>￥{data.price}</Text>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => this.ShareActionSheet.show()}
                        >
                            <Image style={styles.share} source={require('../../images/goodsDetail/share.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.titleBot, PublicStyles.rowBetweenCenter]}>
                    <Text style={PublicStyles.descTwo9}>库存 {data.stock}</Text>
                    <Text style={PublicStyles.descTwo9}>销量 {data.sale_num}</Text>
                    <Text style={PublicStyles.descTwo9}>运费 {data.freight_fee}</Text>
                </View>
            </View>
        )
    }

    detail(data) {
        const { navigation } = this.props
        return (
            <View style={styles.body}>
                <Text style={[styles.detailTitle, PublicStyles.boldTitle]}>商品详情</Text>
                {/* <WebHtmlView
                    source={{ html: htmlContent }}
                    innerCSS="body { font-size: 93%; font-family: serif; text-align: justify }"
                /> */}
                {
                    Array.isArray(data.body) && data.body.length > 0 && data.body.map((item, index) => {
                        switch (item.type) {
                            case "goods":
                                return <Goods key={index} data={item} />;
                            case "separator":
                                return <Separator key={index} data={item} />;
                            case "image":
                                return <BodyImage key={index} url={item.value.url} navigation={navigation}/>;
                            case "video":
                                return <Video key={index} data={item} navigation={navigation}/>;
                            case "text":
                                return <BodyText key={index} content={item.value.content} />;
                            default:
                                return <Text key={index}>NULL</Text>;
                        }
                    })
                }
            </View>
        )
    }

    botView() {
        const { screenProps, navigation, login, is_collect } = this.props;
        const { cartNum } = screenProps;
        const leftText = [PublicStyles.descTwo9, { fontSize: 10, marginTop: 6 }]
        const collectImg = is_collect ? require('../../images/goodsDetail/collected.png') : require('../../images/goodsDetail/collect.png')
        return (
            <SafeAreaView style={{ backgroundColor: '#fff' }}>
                <View style={styles.bot}>
                    <View style={[PublicStyles.rowCenter, styles.botLeft]}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={styles.botItem}
                            onPress={this.onCollect}
                        >
                            <Image source={collectImg} />
                            <Text style={leftText}>收藏</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={styles.botItem}
                            onPress={() => {
                                navigation.navigate(login ? 'Cart' : 'UserLogin')
                            }}
                        >
                            <Image source={require('../../images/goodsDetail/cart.png')} />
                            <Text style={leftText}>购物车</Text>
                            {
                                cartNum ? <Badge
                                    textStyle={{ color: '#fff', fontSize: 11, paddingHorizontal: 2 }}
                                    style={{ position: 'absolute', right: 4, top: -1 }}
                                    minHeight={18}
                                    minWidth={18}
                                >
                                    {cartNum}
                                </Badge> : null
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.botRight]}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={[styles.botItem, { backgroundColor: ThemeStyle.ThemeColor2 }]}
                            onPress={() => {
                                this.setState({
                                    specVisible: true,
                                    if_cart: 1
                                })
                            }}
                        >
                            <Text style={[PublicStyles.title, { color: '#fff' }]}>加入购物车</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={[styles.botItem, { backgroundColor: ThemeStyle.ThemeColor }]}
                            onPress={() => {
                                this.setState({
                                    specVisible: true,
                                    if_cart: 0
                                })
                            }}
                        >
                            <Text style={[PublicStyles.title, { color: '#fff' }]}>立即购买</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    onCollect = async () => {
        const { navigation, login, dispatch, is_collect } = this.props;
        const { id } = navigation.state.params;
        if (login) {
            dispatch({
                type: 'goodsCollect/changeState',
                payload: {
                    is_collect,
                    goods_id: id
                }
            })
        }else {
            navigation.navigate('UserLogin')
        }
    }
}

const styles = StyleSheet.create({
    carouselImg: {
        width: windowWidth,
        height: windowWidth
    },
    dotActive: {
        backgroundColor: ThemeStyle.ThemeColor
    },
    dot: {
        marginHorizontal: 6,
        backgroundColor: '#fff',
        height: 7,
        width: 7
    },
    titleWarp: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        marginBottom: 10
    },
    titleTop: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eaeaea',
    },
    title: {
        marginBottom: 15
    },
    price: {
        color: ThemeStyle.ThemeColor,
        fontSize: 19
    },
    share: {},
    titleBot: {
        height: 36
    },
    body: {
        backgroundColor: '#fff'
    },
    detailTitle: {
        padding: 15
    },
    bot: {
        flexDirection: 'row',
        height: 50
    },
    botLeft: {
        flexDirection: 'row',
        width: ((windowWidth * 0.41) / 3) * 2,
        borderTopWidth: 0.5,
        borderTopColor: '#eaeaea',
    },
    botRight: {
        flexDirection: 'row',
        flex: 1
    },
    botItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    popModalTitleView: {
        height: 45,
    },
    popModalTitleLeft: {
        width: 90,
        height: 90,
        borderRadius: 3,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        zIndex: 100
    },
    popModalTitleTight: {
        alignItems: 'flex-start',
        marginLeft: 105,
    },
    popModalTitleTightP: {
        fontSize: 18,
        color: ThemeStyle.ThemeColor,
    },
});

