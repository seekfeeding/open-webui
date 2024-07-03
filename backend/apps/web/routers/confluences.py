import time

from fastapi import Depends, FastAPI, HTTPException, status
from datetime import datetime, timedelta
from typing import List, Union, Optional

from fastapi import APIRouter
from pydantic import BaseModel
import json
import uuid
import logging


from apps.rag.main import store_confluence

from apps.web.models.confluences import (
    Confluences,
    ConfluenceForm,
    ConfluenceModel,
    ConfluenceResponse,
)

from config import CONFLUENCE_URL, CONFLUENCE_PAGE_IDS, CONFLUENCE_TOKEN
from fastapi.concurrency import run_in_threadpool


from utils.utils import get_current_user, get_admin_user
from constants import ERROR_MESSAGES

log = logging.getLogger(__name__)

router = APIRouter()

# 用于存放confluence数据相关方法：更新、删除等

############################
# Refresh Confluence Data
############################
@router.post("/refresh")
async def create_new_doc(user=Depends(get_admin_user)):
    # 判断是否有正在执行刷新任务，有则直接忽略本次请求
    if not Confluences.is_refresh_complete():
        log.info("Last Refresh Was Not Completed")
        return {"status":0, "message": "Last Refresh Was Not Completed"}
    # if page_ids is None or page_ids =="":
    #     log.info("page_id should not be empty")
    page_ids = CONFLUENCE_PAGE_IDS
    log.info(page_ids)
    ids = page_ids.split(',')
    if ids is None or not ids:
        log.info("No Confluence Page To Load")
        return {"result": "No Confluence Page To Load"}
    # 按传入pageid删除sqlite和Chroma，pageid为空则用配置中默认的
    # 按传入pageid加载confluence page，存储到sqlite和Chroma，id用uuid
    result = await run_in_threadpool(insert_to_db, ids, user)
    return {"status":1, "message": result}

def insert_to_db(ids, user):
    log.info("start to insert to db")
    success_count = 0
    for page_id in ids:
        id = str(uuid.uuid4())
        confluence = ConfluenceForm(id=id, page_id=page_id, page_url=CONFLUENCE_URL, page_token=CONFLUENCE_TOKEN)
        insert_result = Confluences.insert_new_confluence(user.id, confluence)
        confluence_store_result = store_confluence(id=id, url=CONFLUENCE_URL, token=CONFLUENCE_TOKEN, page_id=page_id)
        if confluence_store_result["status"]:
            Confluences.update_status_by_id(id=id, status="2")
            success_count = +1
            log.info(f"store confluence {page_id} complete")
        else:
            Confluences.update_status_by_id(id=id, status="3")
            log.error(f"store confluence {page_id} fail !")

    if success_count == len(ids):
        return "Refresh Confluence Success"
    elif 0 < success_count < len(ids):
        return "Refresh Confluence Partial Success"
    elif success_count == 0:
        return "Refresh Confluence Fail"





############################
# test
############################
@router.post("/test", response_model=Optional[ConfluenceResponse])
async def create_new_doc():
     result = Confluences.get_confluence_by_pageid('860327333')
     return result
@router.post("/test4")
async def create_new_doc():
     result = "success"
     return {"message":result,"status":1}
@router.post("/test3")
async def create_new_doc():
     result = "success"
     return result

def blocking_task():
    time.sleep(3)
    return "Task Complete"
@router.post("/test2")
async def run_blocking():
    result = await run_in_threadpool(blocking_task)
    return {"result": result}