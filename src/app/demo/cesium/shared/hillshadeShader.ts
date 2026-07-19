// hillshade 片元着色器（从参考 demos 提取，作用于 viewer.scene.globe.material）。
// 依赖地形顶点法线（slope / aspect），因此使用时需 requestVertexNormals。

export const HILLSHADE_FRAGMENT = `
czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);

    float slope = materialInput.slope;
    float aspect = materialInput.aspect;

    vec2 u_light = vec2(0.5, 5.497787143782138);
    vec4 u_shadow = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 u_highlight = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 u_accent = vec4(1.0, 1.0, 1.0, 1.0);
    float PI = 3.1415926535897;

    float intensity = u_light.x;
    float azimuth = u_light.y + PI;
    float base = 1.875 - intensity * 1.75;
    float maxValue = 0.5 * PI;
    float scaledSlope = intensity != 0.5 ? ((pow(base, slope) - 1.0) / (pow(base, maxValue) - 1.0)) * maxValue : slope;

    float accent = cos(scaledSlope);
    vec4 accent_color = (1.0 - accent) * u_accent * clamp(intensity * 2.0, 0.0, 1.0);
    float shade = abs(mod((aspect + azimuth) / PI + 0.5, 2.0) - 1.0);
    vec4 shade_color = mix(u_shadow, u_highlight, shade) * sin(scaledSlope) * clamp(intensity * 2.0, 0.0, 1.0);
    vec4 out_FragColor = accent_color * (1.0 - shade_color.a) + shade_color;

    material.diffuse = out_FragColor.rgb;
    material.alpha = out_FragColor.a;
    return material;
}
`;
