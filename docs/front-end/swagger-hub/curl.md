---
title: Curl
head:
  - - meta
    - name: description
      content: Curl学习日志
  - - meta
    - name: keywords
      content: Curl swaggerhub swagger-ui swagger
---

:::warning 注意
> 如果安装了git的话，则不需要再安装curl，因为git已经帮你安装好了
>> 但是，git安装的curl版本较低--git(v2.32.0)的curl(v7.55.0)

百度下载并按照网上教程配置好curl环境变量后，在Windows Poweshell中调用`curl + 参数`（例如`curl -h`）始终提示不对。应该是`curl.exe + 参数`（例如`curl.exe -h`）
:::

:::tip 提示
以下内容源于[**<u>阮一峰 curl的用法指南</u>**](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)。但由于阮老师久未更新此篇，因此有许多命令已经不适用。本篇是curl的最新版-7.78.0，用以日常使用查看!
:::

> 用法：`curl [options...] <url>`

不带有任何参数时，curl 就是发出 GET 请求。

```bash
$ curl https://www.baidu.com
```

上面命令向www.baidu.com发出 GET 请求，服务器返回的内容会在命令行输出。

## -A(--user-agent)

> 要发送到服务器的 User-Agent

-A参数指定客户端的用户代理标头，即User-Agent。curl 的默认用户代理字符串是curl/[version]。

```bash
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://google.com
```

上面命令将User-Agent改成 Chrome 浏览器。

```bash
curl -A '' https://google.com
```

上面命令会移除User-Agent标头。

也可以通过-H参数直接指定标头，更改User-Agent。

```bash
curl -H 'User-Agent: php/1.0' https://google.com
```

## -a(--append)

> 添加要上传的文件

### --basic

> 使用HTTP基础认证（Basic Authentication）

### --cacert FILE

> CA 证书，用于每次请求认证

### --capath DIR

> CA 证书目录

### --aws-sigv4 [provider1[:provider2[:region[:service]]]]

> 使用AWS V4签名认证

## -B(--use-ascii)

> 使用ASCII/text传输

## -b(--cookie STRING/FILE)

> Cookies字符串或读取Cookies的文件位置

-b参数用来向服务器发送 Cookie。

```bash
curl -b 'session=abcdef' https://google.com
```

上面命令会生成一个标头Cookie: session=abcdef，向服务器发送一个名为session、值为abcdef的 Cookie。

```bash
curl -b 'session=abcdef' -b 'loggedin=true' https://google.com
```

上面命令发送两个 Cookie。

```bash
curl -b cookies.txt https://www.google.com
```

上面命令读取本地文件cookies.txt，里面是服务器设置的 Cookie（参见[-c参数](#c-cookie-jar)），将其发送到服务器。

```bash
curl -c cookies.txt https://www.google.com
```

## -C(--continue-at OFFSET)

> 断点续转

## -c(--cookie-jar FILE)

> 操作结束后，要写入 Cookies 的文件位置

-c参数将服务器设置的 Cookie 写入一个文件。

```bash
curl -c cookies.txt https://www.google.com
```

上面命令将服务器的 HTTP 回应所设置 Cookie 写入文本文件cookies.txt。

### --create-dirs

> 创建必要的本地目录层次结构

### --crlf

> 在上传时将 LF 转写为 CRLF

### --crlfile FILE

> 从指定的文件获得PEM格式CRL列表

## -D(--dump-header FILE)

> 将头信息写入指定的文件

### --egd-file FILE

> 为随机数据设置EGD socket路径(SSL)

### --engine ENGINGE

> 加密引擎 (SSL). "--engine list" 指定列表

## -d(--data DATA)

> HTTP POST 数据

-d参数用于发送 POST 请求的数据体。

```bash
curl -d'login=emma＆password=123'-X POST https://google.com/login
# 或者
curl -d 'login=emma' -d 'password=123' -X POST  https://google.com/login
```

使用-d参数以后，HTTP 请求会自动加上标头Content-Type : application/x-www-form-urlencoded。并且会自动将请求转为 POST 方法，因此可以省略-X POST。

-d参数可以读取本地文本文件的数据，向服务器发送。

```bash
curl -d '@data.txt' https://google.com/login
```

上面命令读取data.txt文件的内容，作为数据体向服务器发送。

### --data-urlencode DATA

> url 编码 HTTP POST 数据

--data-urlencode参数等同于-d，发送 POST 请求的数据体，区别在于会自动将发送的数据进行 URL 编码。

```bash
curl --data-urlencode 'comment=hello world' https://google.com/login
```

上面代码中，发送的数据hello world之间有一个空格，需要进行 URL 编码。

### --data-ascii DATA

> ASCII 编码 HTTP POST 数据

### --data-binary DATA

> binary 编码 HTTP POST 数据

### --delegation STRING

> GSS-API 委托权限

### --digest`

> 使用数字身份验证

### --disable-eprt

> 禁止使用 EPRT 或 LPRT

### --disable-epsv

> 禁止使用 EPSV

## -E(--cert CERT[:PASSWD])

> 客户端证书文件及密码

### --cert-type TYPE

> 证书文件类型 (DER/PEM/ENG)

### --ciphers LIST

> SSL 秘钥

### --compressed

> 请求压缩 (使用 deflate 或 gzip)

## -e(--referer)

> Referer URL

-e参数用来设置 HTTP 的标头Referer，表示请求的来源。

```bash
curl -e 'https://google.com?q=example' https://www.example.com
```

上面命令将Referer标头设为https://google.com?q=example。

-H参数可以通过直接添加标头Referer，达到同样效果。

```bash
curl -H 'Referer: https://google.com?q=example' https://www.example.com
```

## -F(--form CONTENT)

> 模拟 HTTP 表单数据提交（multipart POST）

-F参数用来向服务器上传二进制文件。

```bash
curl -F 'file=@photo.png' https://google.com/profile
```

上面命令会给 HTTP 请求加上标头Content-Type: multipart/form-data，然后将文件photo.png作为file字段上传。

-F参数可以指定 MIME 类型。

```bash
curl -F 'file=@photo.png;type=image/png' https://google.com/profile
```

上面命令指定 MIME 类型为image/png，否则 curl 会把 MIME 类型设为application/octet-stream。

-F参数也可以指定文件名。

```bash
curl -F 'file=@photo.png;filename=me.png' https://google.com/profile
```

上面命令中，原始文件名为photo.png，但是服务器接收到的文件名为me.png。

### --form-string STRING

> 模拟 HTTP 表单数据提交

### --ftp-account DATA

> 帐户数据提交

### --ftp-alternative-to-user COMMAND

> 指定替换 "USER [name]" 的字符串

### --ftp-create-dirs

> 如果不存在则创建远程目录

### --ftp-method

> [MULTICWD/NOCWD/SINGLECWD] 控制 CWD

### --ftp-pasv

> 使用 PASV/EPSV 替换 PORT

## -f(--fail)

> 连接失败时不显示HTTP错误信息

## -G(--get)

> 使用 HTTP GET 方法发送 -d 数据

-G参数用来构造 URL 的查询字符串。

```bash
curl -G -d 'q=kitties' -d 'count=20' https://google.com/search
```

上面命令会发出一个 GET 请求，实际请求的 URL 为https://google.com/search?q=kitties&count=20。如果省略--G，会发出一个 POST 请求。

如果数据需要 URL 编码，可以结合--data--urlencode参数。

```bash
curl -G --data-urlencode 'comment=hello world' https://www.example.com
```

## -g(--globoff)

> 禁用的 URL 队列 及范围使用 {} 和 []

## -H(--header LINE)

> 要发送到服务端的自定义请求头

-H参数添加 HTTP 请求的标头。

```bash
curl -H 'Accept-Language: en-US' https://google.com
```

上面命令添加 HTTP 标头Accept-Language: en-US。

```bash
curl -H 'Accept-Language: en-US' -H 'Secret-Message: xyzzy' https://google.com
```

上面命令添加两个 HTTP 标头。

```bash
curl -d '{"login": "emma", "pass": "123"}' -H 'Content-Type: application/json' https://google.com/login
```

上面命令添加 HTTP 请求的标头是Content-Type: application/json，然后用-d参数发送 JSON 数据。

## -h(--help)

> 显示帮助

## -I(--head)

> 仅显示响应文档头

-I参数向服务器发出 HEAD 请求，然会将服务器返回的 HTTP 标头打印出来。

```bash
curl -I https://www.example.com
```

上面命令输出服务器对 HEAD 请求的回应。

--head参数等同于-I。

```bash
curl --head https://www.example.com
```

## -i(--include)

> 在输出中包含协议头

-i参数打印出服务器回应的 HTTP 标头。

```bash
curl -i https://www.example.com
```

上面命令收到服务器回应后，先输出服务器回应的标头，然后空一行，再输出网页的源码。

## -J(--remote-header-name)

> 从远程文件读取头信息

## -j(--junk-session-cookies)

> 读取文件中但忽略会话cookie

### --keepalive-time SECONDS

> keepalive 包间隔

### --key KEY

> 私钥文件名 (SSL/SSH)

### --key-type TYPE

> 私钥文件类型 (DER/PEM/ENG) (SSL)

### --krb LEVEL

> 启用指定安全级别的 Kerberos

### --libcurl FILE

> 命令的libcurl等价代码

### --limit-rate RATE

> 限制传输速度

## -K(--config FILE)

> 指定配置文件

### --connect-timeout SECONDS

> 连接超时设置

## -k(--insecure)

> 允许连接到 SSL 站点，而不使用证书

-k参数指定跳过 SSL 检测。

```bash
curl -k https://www.example.com
```

上面命令不会检查服务器的 SSL 证书是否正确。

### --interface INTERFAC

> 指定网络接口／地址

## -L(--location)

> 跟踪重定向

-L参数会让 HTTP 请求跟随服务器的重定向。curl 默认不跟随重定向。

```bash
curl -L -d 'tweet=hi' https://api.twitter.com/tweet
```

### --location-trusted

> 类似 --location 并发送验证信息到其它主机

## -l(--list-only)

> 只列出FTP目录的名称

### --limit-rate RANGE

> 类似 --location 并发送验证信息到其它主机

--limit-rate用来限制 HTTP 请求和回应的带宽，模拟慢网速的环境。

```bash
curl --limit-rate 200k https://google.com
```

上面命令将带宽限制在每秒 200K 字节。

## -M(--manual)

> 显示全手动

### --mail-from FROM

> 从这个地址发送邮件

### --mail-rcpt TO

> 发送邮件到这个接收人(s)

### --mail-auth AUTH

> 原始电子邮件的起始地址

### --max-filesize BYTES

> 下载的最大文件大小 (H/F)

### --max-redirs NUM

> 最大重定向数 (H)

## -m(--max-time SECONDS)

> 允许的最多传输时间

### --metalink

> 处理指定的URL上的XML文件

### --negotiate

> 使用 HTTP Negotiate 认证

## -N(--netrc)

> 必须从 .netrc 文件读取用户名和密码

### --netrc-optional

> 使用 .netrc 或 URL; 将重写 -n 参数

### --netrc-file FILE

> 设置要使用的 netrc 文件名

## -n(--no-buffer)

> 禁用输出流的缓存

### --no-keepalive

> 禁用 connection 的 keepalive

### --no-sessionid

> 禁止重复使用 SSL session-ID (SSL)

### --noproxy

> 不使用代理的主机列表

### --ntlm

> 使用 HTTP NTLM 认证

## -O(--remote-name)

> 将输出写入远程文件

-O参数将服务器回应保存成文件，并将 URL 的最后部分当作文件名。

```bash
curl -O https://www.example.com/foo/bar.html
```

上面命令将服务器回应保存成文件，文件名为bar.html。

### --remote-name-all

> 使用所有URL的远程文件名

## -o(--output FILE)

> 将输出写入文件，而非 stdout

-o参数将服务器的回应保存成文件，等同于wget命令。

```bash
curl -o example.html https://www.example.com
```

上面命令将www.example.com保存成example.html。

### --pass PASS

> 传递给私钥的短语 (SSL/SSH)

### --post301

> 在 301 重定向后不要切换为 GET 请求

### --post302

> 在 302 重定向后不要切换为 GET 请求

### --post303

> 在 303 重定向后不要切换为 GET 请求

## -P(--ftp-port ADR)

> 使用指定 PORT 及地址替换 PASV

### --ftp-skip-pasv-ip

> 跳过 PASV 的IP地址

### --ftp-pret

> 在 PASV 之前发送 PRET (drftpd)

### --ftp-ssl-ccc

> 在认证之后发送 CCC

### --ftp-ssl-ccc-mode

> ACTIVE/PASSIVE  设置 CCC 模式

### --ftp-ssl-control

> ftp 登录时需要 SSL/TLS

## -p(--proxytunne)

> 使用HTTP代理 (用于 CONNECT)

### --pubkey KEY

> 公钥文件名 (SSH)

## -Q(--quote CMD)

> 在传输开始前向服务器发送命令

### --random-file FILE

> 读取随机数据的文件 (SSL)

## -q(--data)

> .curlrc 如果作为第一个参数无效

## -R(--remote-time)

> 将远程文件的时间设置在本地输出上

## -r(--range RANGE)

> 仅检索范围内的字节

### --raw

> 使用原始HTTP传输，而不使用编码

## -S(--show-error)

> 显示错误. 在选项 -s 中，当 curl 出现错误时将显示

-S参数指定只输出错误信息，通常与-s一起使用。

```bash
curl -s -o /dev/null https://google.com
```

上面命令没有任何输出，除非发生错误。

## -s(--silent)

> Silent模式。不输出任务内容

-s参数将不输出错误和进度信息。

```bash
curl -s https://www.example.com
```

上面命令一旦发生错误，不会显示错误信息。不发生错误的话，会正常显示运行结果。

如果想让 curl 不产生任何输出，可以使用下面的命令。

```bash
curl -s -o /dev/null https://google.com
```

### --socks4 HOST[:PORT]

> 在指定的 host + port 上使用 SOCKS4 代理

### --socks4a HOST[:PORT]

> 在指定的 host + port 上使用 SOCKSa 代理

### --socks5 HOST[:PORT]

> 在指定的 host + port 上使用 SOCKS5 代理

### --socks5-hostname HOST[:PORT]

> SOCKS5 代理，指定用户名、密码

### --socks5-gssapi-service NAME

> SOCKS5 代理，指定用户名、密码

### --socks5-gssapi-nec

> 与NEC Socks5服务器兼容

## -T(--upload-file FILE)

> 将文件传输（上传）到指定位置

### --url URL

> 指定所使用的 URL

## -t(--telnet-option OPT=VAL)

> 设置 telnet 选项

### --tftp-blksize VALUE

> 设备 TFTP BLKSIZE 选项 (必须 >512)

## -U(--proxy-user USER[:PASSWORD])

> 代理用户名及密码

### --proxy1.0 HOST[:PORT]

> 在指定的端口上使用 HTTP/1.0 代理

## -u(--user USER[:PASSWORD])

> 指定服务器认证用户名、密码

-u参数用来设置服务器认证的用户名和密码。

```bash
curl -u 'bob:12345' https://google.com/login
```

上面命令设置用户名为bob，密码为12345，然后将其转为 HTTP 标头Authorization: Basic Ym9iOjEyMzQ1。

curl 能够识别 URL 里面的用户名和密码。

```bash
curl https://bob:12345@google.com/login
```

上面命令能够识别 URL 里面的用户名和密码，将其转为上个例子里面的 HTTP 标头。

```bash
curl -u 'bob' https://google.com/login
```

上面命令只设置了用户名，执行后，curl 会提示用户输入密码。

### --tlsuser USER

> TLS 用户名

### --tlspassword STRING

> TLS 密码

### --tlsauthtype STRING

> TLS 认证类型 (默认 SRP)

### --unix-socket FILE

> 通过这个 UNIX socket 域连接

## -V(--version)

> 显示版本号并退出

## -v(--verbose)

> 显示详细操作信息

-v参数输出通信的整个过程，用于调试。

```bash
curl -v https://www.example.com
```

--trace参数也可以用于调试，还会输出原始的二进制数据。

```bash
curl --trace - https://www.example.com
```

## -w(--write-out FORMAT)

> 完成后输出什么

### --xattr

> 将元数据存储在扩展文件属性中

## -X(--request COMMAND)

> 使用指定的请求命令

-X参数指定 HTTP 请求的方法。

```bash
curl -X POST https://www.example.com
```

上面命令对https://www.example.com发出 POST 请求。

### --resolve HOST:PORT:ADDRESS

> 将 HOST:PORT 强制解析到 ADDRESS

### --retry NUM

> 出现问题时的重试次数

### --retry-delay SECONDS

> 重试时的延时时长

### --retry-max-time SECONDS

> 仅在指定时间段内重试

## -x(--proxy [PROTOCOL://]HOST[:PORT])

> 在指定的端口上使用代理

-x参数指定 HTTP 请求的代理。

```bash
curl -x socks5://james:cats@myproxy.com:8080 https://www.example.com
```

上面命令指定 HTTP 请求通过myproxy.com:8080的 socks5 代理发出。

如果没有指定代理协议，默认为 HTTP。

```bash
curl -x james:cats@myproxy.com:8080 https://www.example.com
```

上面命令中，请求的代理使用 HTTP 协议。

### --proxy-anyauth

> 在代理上使用 "any" 认证方法

### --proxy-basic

> 在代理上使用 Basic 认证 

### --proxy-digest

> 在代理上使用 Digest 认证

### --proxy-negotiate

> 在代理上使用 Negotiate 认证

### --proxy-ntlm

> 在代理上使用 NTLM 认证

## -Y(--speed-limit RATE)

> 在指定限速时间之后停止传输

## -y(--speed-time SECONDS)

> 指定时间之后触发限速. 默认 30

### --ssl

> 尝试 SSL/TLS (FTP, IMAP, POP3, SMTP)

### --ssl-reqd

> 需要 SSL/TLS (FTP, IMAP, POP3, SMTP)

## -z(--time-cond TIME)

> 基于时间条件的传输

## -#(--progress-bar)

> 以进度条显示传输进度

### --proto PROTOCOLS

> 启用/禁用 指定的协议

### --proto-redir PROTOCOLS

> 在重定向上 启用/禁用 指定的协议

## -1(--tlsv1)

> 使用 => TLSv1 (SSL)

### --tlsv1.0

> 使用 TLSv1.0 (SSL)

### --tlsv1.1

> 使用 TLSv1.1 (SSL)

### --tlsv1.2

> 使用 TLSv1.2 (SSL)

### --trace FILE

> 将 debug 信息写入指定的文件

### --trace-ascii FILE

> 类似 --trace 但使用16进度输出

### --trace-time

> 向 trace/verbose 输出添加时间戳

### --tr-encoding

> 请求压缩传输编码

## -2(--sslv2)

> 使用 SSLv2 (SSL)

## -3(--sslv3)

> 使用 SSLv3 (SSL)

### --ssl-allow-beast

> 允许的安全漏洞，提高互操作性(SSL)

### --stderr FILE

> 重定向 stderr 的文件位置. - means stdout

### --tcp-nodelay

> 使用 TCP_NODELAY 选项
