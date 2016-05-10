'use strict'

import {
    REQUEST_TOPICS,RESPONSE_TOPICS,
    REQUEST_TOPIC,RESPONSE_TOPIC,
    CHANGE_CATEGORY,FILTER_TOPICS,
    START_SAVEREPLY,FINISH_SAVEREPLY
} from "./constant"

import {fromNow} from "../lib/helper"


const initialState = {
    selectedCategory:"",
    categories:{
        "":{
            name:"全部",
            pageIndex:1,
            list:[]
        },
        "good":{
            name:"精华",
            pageIndex:1,
            list:[]
        },
        "share":{
            name:"分享",
            pageIndex:1,
            list:[]
        },
        "job":{
            name:"招聘",
            pageIndex:1,
            list:[]
        }
    }
}

export function topicsReducer(state= initialState,action) {
    let categories = {...state.categories}
    switch(action.type){
        case CHANGE_CATEGORY:
            return {
                ...state,
                selectedCategory:action.category
            }
        case FILTER_TOPICS:
            Object.keys(categories).map((category)=>{
                if(category === state.selectedCategory){
                    categories[category].list = categories[category].list.filter((v)=>{
                        return v.title.indexOf(action.keyword) > -1
                    })
                }
            })
            return {
                ...state,
                categories
            }
        case REQUEST_TOPICS:
            return {
                ...state,
                topicsFetching:true
            }
        case RESPONSE_TOPICS:
            Object.keys(categories).map((category)=>{
                if(category === state.selectedCategory){
                    categories[category].list = [].concat(categories[category].list,action.ret.data.map((v)=>{
                        v.create_at = fromNow(v.create_at)
                        return v
                    }))
                    categories[category].pageIndex = action.pageIndex
                }
            })
            return {
                ...state,
                topicsFetching:false,
                topicsFetched:action.ret.success,
                categories
            }
        default:
            return state
    }
}

export function topicReducer(state={},action){
    switch(action.type){
        case REQUEST_TOPIC:
            return {
                ...state,
                topicFetching:true
            }
        case RESPONSE_TOPIC:
            let topic = {...action.ret.data}
            topic.create_at = fromNow(topic.create_at)
            topic.last_reply_at = fromNow(topic.last_reply_at)
            topic.replies = topic.replies.map((reply)=>{
                reply.create_at = fromNow(reply.create_at)
                return reply
            })
            return {
                ...state,
                // id:action.id,
                topicFetching:false,
                topicFetched:action.ret.success,
                topic
            }        
        default:
            return state
    }
}

export function replyReducer(state={},action){
    switch(action.type){
        case START_SAVEREPLY:
            return {
                ...state,
                replySaving:true
            }
        case FINISH_SAVEREPLY:
            return {
                ...state,
                replySaving:false,
                replySaved:action.ret.success,
                replyId:action.ret.reply_id
            }
        default:
            return state
    }
}