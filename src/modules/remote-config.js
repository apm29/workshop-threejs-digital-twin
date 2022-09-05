import { remote } from "~/composables";
import { localToken } from "~/composables";
import { Message } from "element-ui";

const JAVA_SUCCESS_CODE = 200;
const JAVA_SUCCESS_STATUS = "1";
const loadingCount = ref(0);

export const install = () => {
  remote.init({
    //缓存获取相关
    onCacheRetrieve(option) {
      return null;
    },

    //设置token
    onInterceptRequest(axiosRequest, option) {
      axiosRequest.headers.Authorization = option.token || unref(localToken) || "";
      return axiosRequest;
    },
    //响应处理
    onInterceptResponse(axiosResponse, option) {
      return new Promise((resolve, reject) => {
        if (axiosResponse.status === 200) {
          //在此处进行响应拦截
          if (axiosResponse.data.code === JAVA_SUCCESS_CODE || axiosResponse.data.status === JAVA_SUCCESS_STATUS) {
            if (option.showSuccessMessage) {
              Message.success(axiosResponse.data.msg || axiosResponse.data.text || "操作成功");
            }
            resolve(axiosResponse.data);
          } else {
            Message.error(axiosResponse.data.msg || axiosResponse.data.text);
            reject(axiosResponse.data.msg);
          }
        } else {
          Message.error(axiosResponse.data.msg || axiosResponse.statusText);
          reject(axiosResponse);
        }
      });
    },

    onInterceptRejectedRequest(error, option) {
      if (option.showErrorMessage && error) {
        Message.error(
          error.message || String(error)
        );
      }
      return error;
    },
    onInterceptRejectedResponse(error, option) {
      if (option.showErrorMessage && error) {
        Message.error(error.message || String(error));
      }
      return error;
    },

    startLoading(option) {
      if (!option.silent) {
        loadingCount.value += 1;
        if (unref(loadingCount) > 0) {
        }
      }
    },
    stopLoading(option) {
      if (!option.silent) {
        loadingCount.value -= 1;
        if (unref(loadingCount) <= 0) {
        }
      }
    },
  });
}
