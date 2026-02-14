package fr.nexaworlds.nexalink.commands;

import fr.nexaworlds.nexalink.NexaLink;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabExecutor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NexaLinkCommand implements TabExecutor {

    private final NexaLink plugin;

    public NexaLinkCommand(NexaLink plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.hasPermission("nexalink.admin")) {
            sender.sendMessage(ChatColor.RED + "Vous n'avez pas la permission.");
            return true;
        }

        if (args.length == 0) {
            sendHelp(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "reload":
                plugin.reloadConfig();
                sender.sendMessage(ChatColor.GREEN + "[NexaLink] Configuration rechargée.");
                break;

            case "status":
                sender.sendMessage(ChatColor.GOLD + "=== NexaLink Status ===");
                sender.sendMessage(ChatColor.GRAY + "Version: " + ChatColor.WHITE + plugin.getDescription().getVersion());
                sender.sendMessage(ChatColor.GRAY + "API URL: " + ChatColor.WHITE + plugin.getConfig().getString("api.url"));
                sender.sendMessage(ChatColor.GRAY + "Joueurs: " + ChatColor.WHITE + plugin.getServer().getOnlinePlayers().size());
                double[] tps = plugin.getServer().getTPS();
                sender.sendMessage(ChatColor.GRAY + "TPS: " + ChatColor.WHITE +
                        String.format("%.1f / %.1f / %.1f", tps[0], tps[1], tps[2]));
                break;

            case "sync":
                sender.sendMessage(ChatColor.YELLOW + "[NexaLink] Synchronisation forcée...");
                plugin.getSyncService().stopAll();
                plugin.getSyncService().startAll();
                sender.sendMessage(ChatColor.GREEN + "[NexaLink] Synchronisation relancée.");
                break;

            default:
                sendHelp(sender);
        }

        return true;
    }

    private void sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== NexaLink ===");
        sender.sendMessage(ChatColor.YELLOW + "/nexalink reload" + ChatColor.GRAY + " - Recharger la config");
        sender.sendMessage(ChatColor.YELLOW + "/nexalink status" + ChatColor.GRAY + " - Voir le statut");
        sender.sendMessage(ChatColor.YELLOW + "/nexalink sync" + ChatColor.GRAY + " - Forcer la synchronisation");
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 1) {
            return Arrays.asList("reload", "status", "sync");
        }
        return new ArrayList<>();
    }
}
