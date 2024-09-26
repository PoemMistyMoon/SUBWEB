import './assets/css/index.less';
import { Options } from './types';
import { backendConfig, externalConfig, targetConfig } from './config';

let subUrl = '';

function copyText(copyStr: string) {
    navigator.clipboard.writeText(copyStr).then(() => {
        layui.layer.msg('复制成功~', { icon: 1 });
    }, () => {
        layui.layer.msg('复制失败, 请手动选择复制', { icon: 2 });
    });
}

function generateSubUrl(data: Options) {
    const backend = data.backend || data.backendInput; // 优先使用手动输入的值
    const config = data.config || data.configInput; // 优先使用手动输入的值
    let originUrl = data.url;
    originUrl = encodeURIComponent(originUrl.replace(/(\n|\r|\n\r)/g, '|'));

    let newSubUrl = `${backend}&url=${originUrl}&target=${data.target}`;

    if (config) {
        newSubUrl += `&config=${encodeURIComponent(config)}`;
    }

    if (data.include) {
        newSubUrl += `&include=${encodeURIComponent(data.include)}`;
    }

    if (data.exclude) {
        newSubUrl += `&exclude=${encodeURIComponent(data.exclude)}`;
    }

    if (data.name) {
        newSubUrl += `&filename=${encodeURIComponent(data.name)}`;
    }

    newSubUrl += `&emoji=${data.emoji || 'false'}&append_type=${data.append_type || 'false'}&append_info=${data.append_info || 'false'}&scv=${data.scv || 'false'}&udp=${data.udp || 'false'}&list=${data.list || 'false'}&sort=${data.sort || 'false'}&fdn=${data.fdn || 'false'}&insert=${data.insert || 'false'}`;
    subUrl = newSubUrl;
    $('#result').val(subUrl);
    copyText(subUrl);
}

layui.use(['form'], () => {
    const form = layui.form;

    let childrenHtml = '';
    targetConfig.forEach(option => {
        childrenHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    $('#targetSelecter').append(childrenHtml);

    childrenHtml = '';
    externalConfig.forEach(group => {
        let html = '';
        group.options.forEach(option => {
            html += `<option value="${option.value}">${option.label}</option>`;
        });
        childrenHtml += `<optgroup label="${group.label}">${html}</optgroup>`;
    });
    $('#configSelecter').append(childrenHtml);

    childrenHtml = '';
    backendConfig.forEach(option => {
        childrenHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    $('#backendSelecter').append(childrenHtml);
    
    // 添加手动输入框
    $('#optionsForm').append(`
        <label for="backendInput">或手动输入后端地址：</label>
        <input type="text" id="backendInput" name="backendInput" placeholder="请输入后端地址">
        <label for="configInput">或手动输入配置地址：</label>
        <input type="text" id="configInput" name="configInput" placeholder="请输入配置地址">
    `);

    form.render('select', 'optionsForm');

    form.on('submit(generate)', target => {
        const data = target.field as Options;
        generateSubUrl(data);
    });

    $('#importToClash').on('click', () => {
        if (!subUrl) { return layui.layer.msg('未生成新的订阅链接', { icon: 2 }); }
        const url = `clash://install-config?url=${encodeURIComponent(subUrl)}`;
        window.open(url);
    });
});
