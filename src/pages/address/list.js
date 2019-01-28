import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView
} from 'react-native';
import { Button } from 'antd-mobile-rn';
import FlatList from "../../components/flatList";
import { AddressApi } from "../../config/api/address";
import { PublicStyles } from '../../utils/style';
import { AddressCard } from "../../components";

export default class AddressList extends Component {
    onAddressChecked(id) {
        const onAddressChange = this.props.navigation.getParam('onAddressChange')
        if (typeof onAddressChange === 'function') {
            onAddressChange(id)
        }
        this.props.navigation.goBack()
    }

    onEdit(id) {
        this.props.navigation.navigate('UserAddressEdit', { id, updateListRow: this.updateListRow })
    }

    onAdd() {
        this.props.navigation.navigate('UserAddressAdd', { updateListRow: this.updateListRow })
    }

    // todo
    updateListRow = () => {
        this.FlatList.manuallyRefresh()
    }

    render() {
        return <View style={[PublicStyles.ViewMax]}>
            <FlatList
                ref={e => this.FlatList = e}
                api={AddressApi.list}
                keyExtractor={e => String(e.id)}
                renderItem={({ item }) => 
                    <AddressCard
                        name={item.truename}
                        phone={item.phone}
                        id={item.id}
                        address={item.combine_detail}
                        onEdit={(id) => {
                            this.onEdit(id)
                        }}
                        onAddressChecked={() => {
                            this.onAddressChecked(item.id)
                        }}
                    />
                }
            />
            <SafeAreaView>
                <Button size="large" onClick={() => this.onAdd()}>+ 新建地址</Button>
            </SafeAreaView>
        </View>
    }
}
const styles = StyleSheet.create({})
