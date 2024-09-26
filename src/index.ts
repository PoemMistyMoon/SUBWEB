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
    const backend = data.backend;
    let originUrl = data.url;
    originUrl = encodeURIComponent(originUrl.replace(/(\n|\r|\n\r)/g, '|'));

    let newSubUrl = `${backend}&url=${originUrl}&target=${data.target}`;

    if (data.config) {
        newSubUrl += `&config=${encodeURIComponent(data.config)}`;
    }

    if (data.include) {
        newSubUrl += `&include=${encodeURIComponent(data.include)}`;
    }

    if (data.exclude) {
        newSubUrl += `&wxclude=${encodeURIComponent(data.exclude)}`;
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

    $('#targetSelecter').append('<input type="text" id="targetInput" placeholder="手动输入或选择" list="targetOptions"><datalist id="targetOptions"></datalist>');
    targetConfig.forEach(option => {
        $('#targetOptions').append(`<option value="${option.value}">${option.label}</option>`);
    });

    $('#configSelecter').append('<input type="text" id="configInput" placeholder="手动输入或选择" list="configOptions"><datalist id="configOptions"></datalist>');
    externalConfig.forEach(group => {
        group.options.forEach(option => {
            $('#configOptions').append(`<option value="${option.value}">${option.label}</option>`);
        });
    });

    let childrenHtml = '';
    backendConfig.forEach(option => {
        childrenHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    $('#backendSelecter').append(childrenHtml);
    form.render('select', 'optionsForm');

    form.on('submit(generate)', target => {
        const data = target.field as Options;
        data.target = $('#targetInput').val(); 
        data.config = $('#configInput').val(); 
        generateSubUrl(data);
    });

    $('#importToClash').on('click', () => {
        if (!subUrl) { return layui.layer.msg('未生成新的订阅链接', { icon: 2 }); }
        const url = `clash://install-config?url=${encodeURIComponent(subUrl)}`;
        window.open(url);
    });
});
