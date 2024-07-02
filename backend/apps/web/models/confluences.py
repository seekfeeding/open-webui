from pydantic import BaseModel
from peewee import *
from playhouse.shortcuts import model_to_dict
from typing import List, Union, Optional
import time
import logging

from utils.utils import decode_token
from utils.misc import get_gravatar_url

from apps.web.internal.db import DB

import json

from config import SRC_LOG_LEVELS

log = logging.getLogger(__name__)
log.setLevel(SRC_LOG_LEVELS["MODELS"])

####################
# Documents DB Schema
####################

# 目前设计，只支持CONFLUENCE_URL="https://confluence.tc.lenovo.com/"
# 相同page直接插入sqlite即可，不更新，会存在相同pageid数据，查最新的
# 然后用id作为Chroma的collection id
# status:0-init,1-running,2-complete，3-fail
class Confluence(Model):
    id = CharField(unique=True)
    page_id = TextField()
    page_url = TextField()
    page_token = TextField()
    # 0-init,1-running,2-complete，3-fail
    status = CharField()
    user_id = CharField()
    timestamp = BigIntegerField()

    class Meta:
        database = DB


class ConfluenceModel(BaseModel):
    id: str
    page_id: str
    page_url: str
    page_token: str
    status: str
    user_id: str
    timestamp: int  # timestamp in epoch


####################
# Forms
####################


class ConfluenceResponse(BaseModel):
    id: str
    page_id: str
    page_url: str
    page_token: str
    status: str
    user_id: str
    timestamp: int


class ConfluenceForm(BaseModel):
    id: str
    page_id: str
    page_url: str
    page_token: str


class ConfluencesTable:
    def __init__(self, db):
        self.db = db
        self.db.create_tables([Confluence])


    def insert_new_confluence(
        self, user_id: str, form_data: ConfluenceForm
    ) -> Optional[ConfluenceModel]:
        confluence = ConfluenceModel(
            **{
                **form_data.model_dump(),
                "status": "0",
                "user_id": user_id,
                "timestamp": int(time.time()),
            }
        )

        try:
            result = Confluence.create(**confluence.model_dump())
            if result:
                log.info(f"insert {form_data.page_id} seccess")
                return result
            else:
                log.info(f"insert {form_data.page_id} fail")

            return None
        except:
            log.info(f"insert {form_data.page_id} error occur")
            return None

    def get_confluence_by_pageid(self, page_id: str) -> Optional[ConfluenceModel]:
        try:
            confluences = Confluence.select().where(Confluence.page_id == page_id).order_by(Confluence.timestamp.desc()).limit(1)
            confluence =confluences.get()
            if confluence is not None:
                return ConfluenceModel(**model_to_dict(confluence))
            else:
                return None
        except:
            return None

    def update_status_by_id(self, id: str, status: str) -> Optional[ConfluenceModel]:
        try:
            confluence = Confluence.update(status=status).where(Confluence.id == id).execute()
            return ConfluenceModel(**model_to_dict(confluence))
        except:
            return None

    # 按pageid分组，查看最后加载的是否完成
    def is_refresh_complete(self) -> Optional[ConfluenceModel]:
        subquery = (Confluence
                    .select(fn.MAX(Confluence.timestamp))
                    .group_by(Confluence.page_id).having(Confluence.status.in_(['0', '1'])))

        confluences = (Confluence.select().where(Confluence.timestamp.in_(subquery)))

        result = confluences.count() == 0
        print(f"result {result}")
        if result:
            log.info("Refresh Finish")
        else:
            log.info("Refresh Not Finish")
        return result

    def get_docs(self) -> List[ConfluenceModel]:
        return [
            ConfluenceModel(**model_to_dict(doc))
            for doc in Confluence.select()
            # .limit(limit).offset(skip)
        ]

Confluences = ConfluencesTable(DB)

if __name__ == '__main__':
    confluence = Confluence.get(Confluence.page_id == "860327333").order_by(Confluence.timestamp.desc).limit(1)
    print(f"id : {confluence.id}")